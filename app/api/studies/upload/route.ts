import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToS3, isValidFileType } from '@/lib/aws-s3';
import { processFileContent } from '@/lib/file-processor';
import { extractStudyDataFromFile, extractStudyDataFromDocumentBytes, validateExtractedData } from '@/lib/claude-api';
import { normalizeExtractedData } from '@/lib/clinical-utils';
import dbConnect from '@/lib/db';
import Study from '@/lib/models/Study';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const studyId = formData.get('studyId') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    if (!isValidFileType(file.name)) {
      return NextResponse.json(
        { error: 'Invalid file type. Supported types: PDF, DOCX, XLSX, CSV, MD, TXT, JSON' },
        { status: 400 }
      );
    }
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Step 1: Upload to S3 first
    console.log('Uploading file to S3...');
    const uploadResult = await uploadFileToS3(
      buffer,
      file.name,
      file.type,
      'clinical-edc/input'
    );
    
    if (!uploadResult.success) {
      console.error('S3 upload failed:', uploadResult.error);
      return NextResponse.json(
        { error: `Failed to upload file to S3: ${uploadResult.error}` },
        { status: 500 }
      );
    }
    
    console.log('File uploaded to S3 successfully:', uploadResult.s3Uri);
    
    // Step 2: Process file content
    console.log('Processing file content...');
    const processingResult = await processFileContent(buffer, file.name);
    
    if (!processingResult.success) {
      console.error('File processing failed:', processingResult.error);
      return NextResponse.json(
        { error: `Failed to process file: ${processingResult.error}` },
        { status: 500 }
      );
    }
    
    console.log('File content processed successfully');
    
    // Step 3: Extract data using Claude API
    console.log('Extracting data with Claude...');
    
    // For PDF files, send the document bytes directly to Claude
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    let extractionResult;
    
    if (fileExtension === 'pdf') {
      // Send PDF bytes directly to Claude for analysis
      extractionResult = await extractStudyDataFromDocumentBytes(
        buffer,
        file.name,
        processingResult.fileType!
      );
    } else {
      // Use text content for other file types
      extractionResult = await extractStudyDataFromFile(
        processingResult.content!,
        file.name,
        processingResult.fileType!
      );
    }
    
    if (!extractionResult.success) {
      return NextResponse.json(
        { error: `Failed to extract data: ${extractionResult.error}` },
        { status: 500 }
      );
    }
    
    // Normalize extracted data to match database schema
    const normalizedData = normalizeExtractedData(extractionResult.extractedData);
    console.log('Normalized data:', JSON.stringify(normalizedData, null, 2));
    
    // Validate normalized data
    const validationResult = await validateExtractedData(normalizedData);
    
    // Create or update study
    let study;
    if (studyId) {
      // Update existing study
      study = await Study.findOneAndUpdate(
        { studyId },
        {
          $push: {
            uploadedFiles: {
              fileName: uploadResult.fileName!,
              originalName: file.name,
              s3Uri: uploadResult.s3Uri!,
              fileSize: uploadResult.fileSize!,
              contentType: uploadResult.contentType!,
              uploadDate: new Date(),
              processingStatus: 'COMPLETED',
              extractedData: normalizedData,
              extractionConfidence: extractionResult.confidence,
              processingTime: extractionResult.processingTime,
              errorMessage: validationResult.errors.length > 0 ? validationResult.errors.join(', ') : undefined
            }
          }
        },
        { new: true }
      );
    } else {
      // Create new study with extracted data
      const extractedData = normalizedData;
      
      study = new Study({
        studyId: `STUDY-${Date.now()}`,
        studyName: extractedData.studyName || 'New Study',
        studyDescription: extractedData.studyDescription || '',
        protocolNumber: extractedData.protocolNumber || '',
        protocolVersion: extractedData.protocolVersion || '1.0',
        protocolTitle: extractedData.protocolTitle || '',
        protocolShortTitle: extractedData.protocolShortTitle || '',
        studyType: extractedData.studyType || 'INTERVENTIONAL',
        studyPhase: extractedData.studyPhase || 'I',
        therapeuticArea: extractedData.therapeuticArea || '',
        indication: extractedData.indication || '',
        keywords: extractedData.keywords || [],
        sponsor: extractedData.sponsor || { name: '', email: '', phone: '', role: 'SPONSOR' },
        principalInvestigator: extractedData.principalInvestigator || { name: '', affiliation: '', email: '', phone: '', type: 'GLOBAL_PI' },
        plannedEnrollment: extractedData.plannedEnrollment || 0,
        studyDesign: extractedData.studyDesign || {
          type: 'PARALLEL_GROUP',
          allocation: 'RANDOMIZED',
          blinding: { type: 'DOUBLE_BLIND', blindedRoles: [], unblindingProcedure: '' },
          control: { type: 'PLACEBO', description: 'Matching placebo' }
        },
        population: extractedData.population || {
          target: '',
          plannedSize: 0,
          ageRange: { minimum: 18, unit: 'YEARS' },
          genderEligibility: 'ALL',
          healthyVolunteers: false,
          geographicScope: 'SINGLE_COUNTRY'
        },
        inclusionCriteria: extractedData.inclusionCriteria || [],
        exclusionCriteria: extractedData.exclusionCriteria || [],
        visits: extractedData.visits || [],
        epochs: extractedData.epochs || [],
        treatmentArms: extractedData.treatmentArms || [],
        objectives: extractedData.objectives || [],
        assessments: extractedData.assessments || {
          safetyAssessments: [],
          efficacyAssessments: [],
          pkAssessments: [],
          biomarkerAssessments: []
        },
        uploadedFiles: [{
          fileName: uploadResult.fileName!,
          originalName: file.name,
          s3Uri: uploadResult.s3Uri!,
          fileSize: uploadResult.fileSize!,
          contentType: uploadResult.contentType!,
          uploadDate: new Date(),
          processingStatus: 'COMPLETED',
          extractedData: extractionResult.extractedData,
          extractionConfidence: extractionResult.confidence,
          processingTime: extractionResult.processingTime,
          errorMessage: validationResult.errors.length > 0 ? validationResult.errors.join(', ') : undefined
        }],
        studyStatus: 'DRAFT',
        processingStatus: 'COMPLETED'
      });
      
      await study.save();
    }
    
    return NextResponse.json({
      success: true,
      study: study,
      extractionResult: {
        confidence: extractionResult.confidence,
        processingTime: extractionResult.processingTime,
        validation: validationResult
      },
      fileInfo: {
        fileName: uploadResult.fileName,
        s3Uri: uploadResult.s3Uri,
        fileSize: uploadResult.fileSize
      }
    });
    
  } catch (error) {
    console.error('Error in upload API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 