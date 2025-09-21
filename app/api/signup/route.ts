import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, discord_id, role, invite_code } = await request.json()
    
    if (!username || !email || !password || !discord_id) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUsers = await db.getUsers()
    const userExists = existingUsers.some(u => 
      u.username === username || u.email === email || u.discord_id === discord_id
    )
    
    if (userExists) {
      return NextResponse.json(
        { success: false, error: 'Un utilisateur avec ce nom, email ou Discord ID existe déjà' },
        { status: 409 }
      )
    }

    let finalRole = role || 'player'

    // Check invite code if provided
    if (invite_code) {
      const usedCode = await db.useInviteCode(invite_code, username)
      if (!usedCode) {
        return NextResponse.json(
          { success: false, error: 'Code d\'invitation invalide ou expiré' },
          { status: 400 }
        )
      }
      finalRole = usedCode.role
    }

    // Create user
    const newUser = await db.addUser({
      username,
      email,
      password, // In production, hash this!
      discord_id,
      role: finalRole,
      status: 'active'
    })

    // Remove password from response
    const { password: _, ...safeUser } = newUser
    return NextResponse.json({ success: true, user: safeUser })
    
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de l\'inscription' },
      { status: 500 }
    )
  }
}