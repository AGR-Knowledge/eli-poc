import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { IStudy } from '@/lib/models/Study'
import mongoose from 'mongoose'

export async function DELETE(
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

    await Study.findOneAndDelete({ studyId: id })

    return NextResponse.json({ 
      success: true, 
      message: 'Study deleted successfully' 
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete study' },
      { status: 500 }
    )
  }
} 