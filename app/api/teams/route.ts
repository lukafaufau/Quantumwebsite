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

// Vérifie que le fichier data existe
async function ensureDataFile() {
  try {
    await fs.access(TEAMS_FILE)
  } catch {
    await fs.mkdir(path.dirname(TEAMS_FILE), { recursive: true })
    await fs.writeFile(TEAMS_FILE, JSON.stringify({ teams: [] }, null, 2))
  }
}

// GET : récupérer toutes les équipes
export async function GET() {
  await ensureDataFile()
  const data = await fs.readFile(TEAMS_FILE, 'utf8')
  const teams = JSON.parse(data)
  return NextResponse.json({ success: true, data: teams.teams || [] })
}

// POST : créer une nouvelle équipe
export async function POST(request: NextRequest) {
  await ensureDataFile()
  const teamData = await request.json()
  if (!teamData.name || !teamData.captain || !teamData.game) {
    return NextResponse.json({ success: false, error: 'Name, captain and game are required' }, { status: 400 })
  }
  const data = await fs.readFile(TEAMS_FILE, 'utf8')
  const teams = JSON.parse(data)
  const newId = (teams.teams?.length ? Math.max(...teams.teams.map((t:any)=>t.id)) : 0) + 1
  const newTeam: Team = { id: newId, name: teamData.name, captain: teamData.captain, members: Array.isArray(teamData.members) ? teamData.members : [], game: teamData.game, description: teamData.description || '', status: teamData.status || 'active', created_at: new Date().toISOString() }
  if (!teams.teams) teams.teams = []
  teams.teams.push(newTeam)
  await fs.writeFile(TEAMS_FILE, JSON.stringify(teams, null, 2))
  return NextResponse.json({ success: true, data: newTeam })
}
