import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const { reason } = await request.json()
    
    const updatedUser = await db.updateUser(id, {
      status: 'banned',
      ban_reason: reason,
      banned_at: new Date().toISOString()
    })
    
    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }
    
    const { password, ...safeUser } = updatedUser
    return NextResponse.json({ success: true, data: safeUser })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to ban user' }, { status: 500 })
  }
}