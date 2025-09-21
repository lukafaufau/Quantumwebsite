import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const updates = await request.json()
    
    const updatedAnnouncement = await db.updateAnnouncement(id, updates)
    if (!updatedAnnouncement) {
      return NextResponse.json({ success: false, error: 'Announcement not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: updatedAnnouncement })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update announcement' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const deleted = await db.deleteAnnouncement(id)
    
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Announcement not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete announcement' }, { status: 500 })
  }
}