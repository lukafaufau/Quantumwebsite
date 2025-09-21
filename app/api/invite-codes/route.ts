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
    
    // Generate random code if not provided
    if (!codeData.code) {
      codeData.code = Math.random().toString(36).substring(2, 15).toUpperCase()
    }
    
    const newCode = await db.addInviteCode({
      ...codeData,
      uses_left: codeData.max_uses || 1
    })
    
    return NextResponse.json({ success: true, data: newCode })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create invite code' }, { status: 500 })
  }
}