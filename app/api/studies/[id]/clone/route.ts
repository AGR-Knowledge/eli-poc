import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { IStudy } from '@/lib/models/Study'
import mongoose from 'mongoose'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    
    const { id } = await params
    const Study = mongoose.model<IStudy>('Study')
    const originalStudy = await Study.findOne({ studyId: id })
    
    if (!originalStudy) {
      return NextResponse.json({ error: 'Study not found' }, { status: 404 })
    }

    // Convert to plain object and remove MongoDB-specific fields
    const studyData = originalStudy.toObject()
    const { _id, __v, createdAt, updatedAt, ...cloneData } = studyData

    // Generate new study ID and update metadata
    const timestamp = Date.now()
    const newStudyId = `${cloneData.studyId}-COPY-${timestamp}`
    
    const clonedStudy = new Study({
      ...cloneData,
      studyId: newStudyId,
      studyName: `${cloneData.studyName} (Copy)`,
      studyStatus: 'DRAFT',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system', // You can update this with actual user ID
      updatedBy: 'system'
    })

    await clonedStudy.save()

    return NextResponse.json({ 
      success: true, 
      studyId: clonedStudy._id,
      newStudyId: newStudyId
    })
  } catch (error) {
    console.error('Clone error:', error)
    return NextResponse.json(
      { error: 'Failed to clone study' },
      { status: 500 }
    )
  }
} 