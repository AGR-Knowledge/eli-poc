import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { IStudy } from '@/lib/models/Study';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const studyData = await request.json();
    
    // Import the Study model
    const Study = (await import('@/lib/models/Study')).default;
    
    // Generate a unique studyId if not provided
    const studyId = studyData.studyId || `STUDY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Prepare study data with defaults for draft status
    const studyDataWithDefaults = {
      ...studyData,
      studyId,
      studyStatus: studyData.studyStatus || 'DRAFT',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: studyData.createdBy || 'System',
      updatedBy: studyData.updatedBy || 'System'
    };
    
    console.log('Saving study data:', JSON.stringify(studyDataWithDefaults, null, 2));
    
    // Create a new study document
    const newStudy = new Study(studyDataWithDefaults);
    
    const savedStudy = await newStudy.save();
    
    return NextResponse.json(savedStudy, { status: 201 });
  } catch (error) {
    console.error('Error creating study:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create study', details: errorMessage },
      { status: 500 }
    );
  }
} 