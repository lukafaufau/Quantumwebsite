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
    
    if (!userData.username || !userData.email || !userData.discord_id) {
      return NextResponse.json({ success: false, error: 'Username, email and discord_id are required' }, { status: 400 })
    }
    
    // Check if user already exists
    const existingUsers = await db.getUsers()
    const userExists = existingUsers.some(u => 
      u.username === userData.username || 
      u.email === userData.email || 
      u.discord_id === userData.discord_id
    )
    
    if (userExists) {
      return NextResponse.json({ success: false, error: 'User already exists' }, { status: 409 })
    }
    
    const newUser = await db.addUser(userData)
    const { password, ...safeUser } = newUser
    return NextResponse.json({ success: true, data: safeUser })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 })
  }
}