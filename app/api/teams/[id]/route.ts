import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const updates = await request.json()
    
    const updatedTeam = await db.updateTeam(id, updates)
    if (!updatedTeam) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: updatedTeam })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update team' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const deleted = await db.deleteTeam(id)
    
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete team' }, { status: 500 })
  }
}