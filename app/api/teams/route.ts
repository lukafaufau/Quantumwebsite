import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET() {
  try {
    const teams = await db.getTeams()
    return NextResponse.json({ success: true, data: teams })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch teams' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const teamData = await request.json()
    
    if (!teamData.name || !teamData.captain || !teamData.game) {
      return NextResponse.json({ success: false, error: 'Name, captain and game are required' }, { status: 400 })
    }
    
    const newTeam = await db.addTeam({
      ...teamData,
      members: teamData.members || [],
      status: teamData.status || 'active'
    })
    return NextResponse.json({ success: true, data: newTeam })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json({ success: false, error: 'Failed to create team' }, { status: 500 })
  }
}