import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Study from '@/lib/models/Study';

// GET /api/studies/[id] - Get a single study with comprehensive data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const study = await Study.findOne({ studyId: id }).lean();
    
    if (!study) {
      return NextResponse.json(
        { error: 'Study not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(study);
  } catch (error) {
    console.error('Error fetching study:', error);
    return NextResponse.json(
      { error: 'Failed to fetch study' },
      { status: 500 }
    );
  }
}

// PUT /api/studies/[id] - Update a study
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const body = await request.json();
    
    const study = await Study.findOneAndUpdate(
      { studyId: id },
      { 
        ...body,
        updatedAt: new Date(),
        updatedBy: 'system'
      },
      { new: true, runValidators: true }
    );
    
    if (!study) {
      return NextResponse.json(
        { error: 'Study not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(study);
  } catch (error) {
    console.error('Error updating study:', error);
    return NextResponse.json(
      { error: 'Failed to update study' },
      { status: 500 }
    );
  }
}

// DELETE /api/studies/[id] - Delete a study
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const study = await Study.findOneAndDelete({ studyId: id });
    
    if (!study) {
      return NextResponse.json(
        { error: 'Study not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Study deleted successfully' });
  } catch (error) {
    console.error('Error deleting study:', error);
    return NextResponse.json(
      { error: 'Failed to delete study' },
      { status: 500 }
    );
  }
} 