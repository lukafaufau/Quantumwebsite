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

// Vérifie que le fichier data existe, sinon le crée
async function ensureDataFile() {
  try {
    await fs.access(TEAMS_FILE)
  } catch {
    const defaultData = { teams: [] }
    await fs.mkdir(path.dirname(TEAMS_FILE), { recursive: true })
    await fs.writeFile(TEAMS_FILE, JSON.stringify(defaultData, null, 2))
  }
}

// Récupération des équipes
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

// Création d'une nouvelle équipe
export async function POST(request: NextRequest) {
  try {
    await ensureDataFile()
    const teamData = await request.json()

    if (!teamData.name || !teamData.captain || !teamData.game) {
      return NextResponse.json({ success: false, error: 'Name, captain and game are required' }, { status: 400 })
    }

    const data = await fs.readFile(TEAMS_FILE, 'utf8')
    const teams = JSON.parse(data)

    const newId = (teams.teams?.length ? Math.max(...teams.teams.map((t: any) => t.id)) : 0) + 1

    const newTeam: Team = {
      id: newId,
      name: teamData.name,
      captain: teamData.captain,
      members: Array.isArray(teamData.members) ? teamData.members : [],
      game: teamData.game,
      description: teamData.description || '',
      status: teamData.status || 'active',
      created_at: new Date().toISOString()
    }

    if (!teams.teams) teams.teams = []
    teams.teams.push(newTeam)
    await fs.writeFile(TEAMS_FILE, JSON.stringify(teams, null, 2))

    return NextResponse.json({ success: true, data: newTeam })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json({ success: false, error: 'Failed to create team' }, { status: 500 })
  }
}

// Modification d'une équipe
export async function PUT(request: NextRequest) {
  try {
    await ensureDataFile()
    const teamData = await request.json()
    if (!teamData.id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })

    const data = await fs.readFile(TEAMS_FILE, 'utf8')
    const teams = JSON.parse(data)

    const index = teams.teams.findIndex((t: Team) => t.id === teamData.id)
    if (index === -1) return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 })

    teams.teams[index] = { ...teams.teams[index], ...teamData }
    await fs.writeFile(TEAMS_FILE, JSON.stringify(teams, null, 2))

    return NextResponse.json({ success: true, data: teams.teams[index] })
  } catch (error) {
    console.error('Error updating team:', error)
    return NextResponse.json({ success: false, error: 'Failed to update team' }, { status: 500 })
  }
}

// Suppression d'une équipe
export async function DELETE(request: NextRequest) {
  try {
    await ensureDataFile()
    const { searchParams } = new URL(request.url)
    const idParam = searchParams.get('id')
    if (!idParam) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })

    const teamId = parseInt(idParam)
    const data = await fs.readFile(TEAMS_FILE, 'utf8')
    const teams = JSON.parse(data)

    const newTeams = teams.teams.filter((t: Team) => t.id !== teamId)
    if (newTeams.length === teams.teams.length) return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 })

    await fs.writeFile(TEAMS_FILE, JSON.stringify({ teams: newTeams }, null, 2))

    return NextResponse.json({ success: true, message: 'Team deleted' })
  } catch (error) {
    console.error('Error deleting team:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete team' }, { status: 500 })
  }
}
