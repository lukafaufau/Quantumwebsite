import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET() {
  try {
    const users = await db.getUsers()
    // Remove passwords from response
    const safeUsers = users.map(({ password, ...user }) => user)
    return NextResponse.json({ success: true, data: safeUsers })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    const newUser = await db.addUser(userData)
    const { password, ...safeUser } = newUser
    return NextResponse.json({ success: true, data: safeUser })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 })
  }
}