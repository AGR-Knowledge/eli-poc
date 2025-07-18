import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Study from '@/lib/models/Study';

// GET /api/studies - Get all studies with comprehensive data
export async function GET(request: NextRequest) {
  try {
    console.log('Connecting to MongoDB...');
    await dbConnect();
    console.log('Connected to MongoDB');
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const therapeuticArea = searchParams.get('therapeuticArea');
    const sponsor = searchParams.get('sponsor');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query filter
    const filter: any = {};
    if (status) filter.studyStatus = status.toUpperCase(); // Convert to uppercase to match DB
    if (therapeuticArea) filter.therapeuticArea = therapeuticArea;
    if (sponsor) filter['sponsor.name'] = sponsor;

    console.log('Fetching studies with filter:', filter);
    const studies = await Study.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    console.log('Found studies:', studies.length);

    const total = await Study.countDocuments(filter);
    console.log('Total studies:', total);

    // Transform data to match the expected format for the frontend
    const transformedStudies = studies.map(study => ({
      _id: study._id,
      id: study.studyId,
      title: study.studyName,
      description: study.studyDescription,
      sponsor: study.sponsor?.name || 'Unknown',
      principalInvestigator: study.principalInvestigator?.name || 'Unknown',
      status: study.studyStatus?.toLowerCase() || 'draft', // Convert to lowercase for frontend
      phase: study.studyPhase || 'I',
      indication: study.indication || 'Unknown',
      therapeuticArea: study.therapeuticArea || 'Unknown',
      startDate: study.milestones?.firstPatientIn?.toISOString() || new Date().toISOString(),
      endDate: study.milestones?.lastPatientOut?.toISOString(),
      enrollmentTarget: study.plannedEnrollment || 0,
      currentEnrollment: study.currentEnrollment || 0,
      sites: [], // Add proper site mapping if needed
      visits: study.visits || [],
      endpoints: study.objectives?.flatMap((obj: any) => obj.endpoints || []) || [],
      inclusionCriteria: study.inclusionCriteria?.map((criteria: any) => criteria.text) || [],
      exclusionCriteria: study.exclusionCriteria?.map((criteria: any) => criteria.text) || [],
      treatments: study.treatmentArms?.map((arm: any) => ({
        treatmentId: arm.code,
        treatmentName: arm.name,
        treatmentType: 'drug',
        description: arm.description
      })) || [],
      documents: [],
      createdAt: study.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: study.updatedAt?.toISOString() || new Date().toISOString(),
      
      // Additional fields for home page display
      participants: study.currentEnrollment || 0,
      completion: study.completionPercentage || 0,
      priority: study.priority || 'MEDIUM',
      processingStatus: study.processingStatus || 'COMPLETED',
      lastActivity: study.lastActivity || 'Just now',
      countries: 1, // Default value
      createdDate: study.createdAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
    }));

    console.log('Transformed studies:', transformedStudies.length);
    return NextResponse.json({
      studies: transformedStudies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching studies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch studies' },
      { status: 500 }
    );
  }
}

// POST /api/studies - Create a new study
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['studyId', 'studyName', 'studyDescription', 'protocolNumber', 'studyType', 'studyPhase', 'therapeuticArea', 'indication'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Create new study with comprehensive data
    const studyData = {
      ...body,
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const study = new Study(studyData);
    await study.save();
    
    return NextResponse.json(study, { status: 201 });
  } catch (error) {
    console.error('Error creating study:', error);
    return NextResponse.json(
      { error: 'Failed to create study' },
      { status: 500 }
    );
  }
} 