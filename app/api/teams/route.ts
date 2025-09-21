import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const TEAMS_FILE = path.join(process.cwd(), 'data', 'teams.json')

interface Team {
  id: number
  name: string
  captain: string
  members: string[]
  game: string
  description?: string
  status: string
  created_at: string
}

async function ensureDataFile() {
  try {
    await fs.access(TEAMS_FILE)
  } catch {
    const defaultData = { teams: [] }
    await fs.mkdir(path.dirname(TEAMS_FILE), { recursive: true })
    await fs.writeFile(TEAMS_FILE, JSON.stringify(defaultData, null, 2))
  }
}

export async function GET() {
  try {
    await ensureDataFile()
    const data = await fs.readFile(TEAMS_FILE, 'utf8')
    const teams = JSON.parse(data)
    return NextResponse.json({ success: true, data: teams.teams || [] })
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch teams' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataFile()
    const teamData = await request.json()
    
    if (!teamData.name || !teamData.captain || !teamData.game) {
      return NextResponse.json({ success: false, error: 'Name, captain and game are required' }, { status: 400 })
    }
    
    const data = await fs.readFile(TEAMS_FILE, 'utf8')
    const teams = JSON.parse(data)
    
    const newTeam: Team = {
      id: Math.max(...(teams.teams?.map((t: any) => t.id) || [0]), 0) + 1,
      name: teamData.name,
      captain: teamData.captain,
      members: Array.isArray(teamData.members) ? teamData.members : [],
      game: teamData.game,
      description: teamData.description,
      status: teamData.status || 'active',
      created_at: teamData.created_at || new Date().toISOString()
    }
    
    if (!teams.teams) {
      teams.teams = []
    }
    teams.teams.push(newTeam)
    
    await fs.writeFile(TEAMS_FILE, JSON.stringify(teams, null, 2))
    
    return NextResponse.json({ success: true, data: newTeam })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json({ success: false, error: 'Failed to create team' }, { status: 500 })
  }
}