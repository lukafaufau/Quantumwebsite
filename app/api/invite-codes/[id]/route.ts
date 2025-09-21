import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const deleted = await db.deleteInviteCode(id)
    
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Invite code not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete invite code' }, { status: 500 })
  }
}