import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const updates = await request.json()
    
    const updatedUser = await db.updateUser(id, updates)
    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }
    
    const { password, ...safeUser } = updatedUser
    return NextResponse.json({ success: true, data: safeUser })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const deleted = await db.deleteUser(id)
    
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 })
  }
}