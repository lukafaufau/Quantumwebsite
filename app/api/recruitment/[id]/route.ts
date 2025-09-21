import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const updates = await request.json()
    
    const updatedApplication = await db.updateRecruitment(id, {
      ...updates,
      reviewed_at: new Date().toISOString()
    })
    
    if (!updatedApplication) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: updatedApplication })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update application' }, { status: 500 })
  }
}