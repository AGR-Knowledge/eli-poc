import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { FormSpecification } from '@/lib/models/FormSpecification'

// GET /api/forms/[formId] - Get specific form specification
export async function GET(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    await dbConnect()
    
    const formSpecification = await FormSpecification.findOne({ 
      formId: params.formId 
    }).lean()
    
    if (!formSpecification) {
      return NextResponse.json(
        { success: false, error: 'Form specification not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: formSpecification
    })
  } catch (error) {
    console.error('Error fetching form specification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch form specification' },
      { status: 500 }
    )
  }
}

// PUT /api/forms/[formId] - Update form specification
export async function PUT(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    await dbConnect()
    
    const body = await request.json()
    
    const formSpecification = await FormSpecification.findOneAndUpdate(
      { formId: params.formId },
      {
        ...body,
        updatedBy: 'system', // TODO: Get from auth context
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
    
    if (!formSpecification) {
      return NextResponse.json(
        { success: false, error: 'Form specification not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: formSpecification,
      message: 'Form specification updated successfully'
    })
  } catch (error) {
    console.error('Error updating form specification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update form specification' },
      { status: 500 }
    )
  }
}

// DELETE /api/forms/[formId] - Delete form specification
export async function DELETE(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    await dbConnect()
    
    const formSpecification = await FormSpecification.findOneAndDelete({ 
      formId: params.formId 
    })
    
    if (!formSpecification) {
      return NextResponse.json(
        { success: false, error: 'Form specification not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Form specification deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting form specification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete form specification' },
      { status: 500 }
    )
  }
} 