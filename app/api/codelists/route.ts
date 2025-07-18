import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { CodeList } from '@/lib/models/CodeList'

// GET /api/codelists - Get all code lists
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const cdiscDomain = searchParams.get('cdiscDomain')
    const cdiscVariable = searchParams.get('cdiscVariable')
    const status = searchParams.get('status')
    const approvalStatus = searchParams.get('approvalStatus')
    
    // Build query
    const query: any = {}
    if (cdiscDomain) query.cdiscDomain = cdiscDomain
    if (cdiscVariable) query.cdiscVariable = cdiscVariable
    if (status) query.status = status
    if (approvalStatus) query.approvalStatus = approvalStatus
    
    const codeLists = await CodeList.find(query)
      .sort({ createdAt: -1 })
      .lean()
    
    return NextResponse.json({
      success: true,
      data: codeLists,
      count: codeLists.length
    })
  } catch (error) {
    console.error('Error fetching code lists:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch code lists' },
      { status: 500 }
    )
  }
}

// POST /api/codelists - Create new code list
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['codeListId', 'codeListName', 'codeListCode', 'cdiscDomain', 'cdiscVariable', 'cdashQuestion']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Check if code list already exists
    const existingCodeList = await CodeList.findOne({ codeListId: body.codeListId })
    if (existingCodeList) {
      return NextResponse.json(
        { success: false, error: 'Code list with this ID already exists' },
        { status: 409 }
      )
    }
    
    // Create new code list
    const codeList = new CodeList({
      ...body,
      createdBy: 'system', // TODO: Get from auth context
      updatedBy: 'system'
    })
    
    await codeList.save()
    
    return NextResponse.json({
      success: true,
      data: codeList,
      message: 'Code list created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating code list:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create code list' },
      { status: 500 }
    )
  }
} 