import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { FormSpecification } from '@/lib/models/FormSpecification'

// GET /api/forms - Get all form specifications
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const studyId = searchParams.get('studyId')
    const cdiscDomain = searchParams.get('cdiscDomain')
    const assessmentCategory = searchParams.get('assessmentCategory')
    const status = searchParams.get('status')
    
    // Build query
    const query: any = {}
    if (studyId) query.studyId = studyId
    if (cdiscDomain) query.cdiscDomain = cdiscDomain
    if (assessmentCategory) query.assessmentCategory = assessmentCategory
    if (status) query.status = status
    
    const forms = await FormSpecification.find(query)
      .sort({ createdAt: -1 })
      .lean()
    
    return NextResponse.json({
      success: true,
      data: forms,
      count: forms.length
    })
  } catch (error) {
    console.error('Error fetching form specifications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch form specifications' },
      { status: 500 }
    )
  }
}

// POST /api/forms - Create new form specification
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['formId', 'studyId', 'formName', 'formCode', 'cdiscDomain', 'cdashCategory']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Check if form already exists
    const existingForm = await FormSpecification.findOne({ formId: body.formId })
    if (existingForm) {
      return NextResponse.json(
        { success: false, error: 'Form specification with this ID already exists' },
        { status: 409 }
      )
    }
    
    // Create new form specification
    const formSpecification = new FormSpecification({
      ...body,
      createdBy: 'system', // TODO: Get from auth context
      updatedBy: 'system'
    })
    
    await formSpecification.save()
    
    return NextResponse.json({
      success: true,
      data: formSpecification,
      message: 'Form specification created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating form specification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create form specification' },
      { status: 500 }
    )
  }
} 