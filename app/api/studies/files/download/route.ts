import { NextRequest, NextResponse } from 'next/server';
import { getSignedDownloadUrl } from '@/lib/aws-s3';
import dbConnect from '@/lib/db';
import Study from '@/lib/models/Study';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const studyId = searchParams.get('studyId');
    const fileName = searchParams.get('fileName');
    
    if (!studyId || !fileName) {
      return NextResponse.json(
        { error: 'Study ID and file name are required' },
        { status: 400 }
      );
    }
    
    // Find the study and get the file information
    const study = await Study.findOne({ studyId });
    if (!study) {
      return NextResponse.json(
        { error: 'Study not found' },
        { status: 404 }
      );
    }
    
    const uploadedFile = study.uploadedFiles?.find((file: any) => file.fileName === fileName);
    if (!uploadedFile) {
      return NextResponse.json(
        { error: 'File not found in study' },
        { status: 404 }
      );
    }
    
    // Generate signed download URL
    const downloadUrl = await getSignedDownloadUrl(uploadedFile.s3Uri);
    
    return NextResponse.json({
      success: true,
      downloadUrl,
      fileInfo: {
        fileName: uploadedFile.fileName,
        originalName: uploadedFile.originalName,
        fileSize: uploadedFile.fileSize,
        contentType: uploadedFile.contentType,
        uploadDate: uploadedFile.uploadDate
      }
    });
    
  } catch (error) {
    console.error('Error generating download URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 