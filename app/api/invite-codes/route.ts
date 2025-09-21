import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET() {
  try {
    const codes = await db.getInviteCodes()
    return NextResponse.json({ success: true, data: codes })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch invite codes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const codeData = await request.json()
    
    if (!codeData.role || !codeData.max_uses || codeData.max_uses < 1) {
      return NextResponse.json({ success: false, error: 'Role and valid max_uses are required' }, { status: 400 })
    }
    
    // Generate random code if not provided
    if (!codeData.code) {
      codeData.code = Math.random().toString(36).substring(2, 15).toUpperCase()
    }
    
    // Check if code already exists
    const existingCodes = await db.getInviteCodes()
    const codeExists = existingCodes.some(c => c.code === codeData.code)
    
    if (codeExists) {
      return NextResponse.json({ success: false, error: 'Code already exists' }, { status: 409 })
    }
    
    const newCode = await db.addInviteCode({
      ...codeData,
      created_by: codeData.created_by || 'Admin',
      uses_left: codeData.max_uses || 1
    })
    
    return NextResponse.json({ success: true, data: newCode })
  } catch (error) {
    console.error('Error creating invite code:', error)
    return NextResponse.json({ success: false, error: 'Failed to create invite code' }, { status: 500 })
  }
}