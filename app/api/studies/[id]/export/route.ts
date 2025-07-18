import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { IStudy } from '@/lib/models/Study'
import mongoose from 'mongoose'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    
    const { id } = await params
    const Study = mongoose.model<IStudy>('Study')
    const study = await Study.findOne({ studyId: id })
    
    if (!study) {
      return NextResponse.json({ error: 'Study not found' }, { status: 404 })
    }

    // Convert to plain object and remove MongoDB-specific fields
    const studyData = study.toObject()
    const { _id, __v, ...cleanData } = studyData

    // Set headers for file download
    const headers = {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="study-${study.studyId}-${new Date().toISOString().split('T')[0]}.json"`
    }

    return NextResponse.json(cleanData, { headers })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export study' },
      { status: 500 }
    )
  }
} 