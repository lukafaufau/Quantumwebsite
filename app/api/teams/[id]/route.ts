import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const TEAMS_FILE = path.join(process.cwd(), 'data', 'teams.json')

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

// PUT : mise à jour d'une équipe
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDataFile()
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid team ID' }, { status: 400 })
    }

    const updates = await request.json()
    console.log('Updates received:', updates)

    const data = await fs.readFile(TEAMS_FILE, 'utf8')
    const teams = JSON.parse(data)

    if (!teams.teams) teams.teams = []

    const index = teams.teams.findIndex((t: any) => t.id === id)
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 })
    }

    teams.teams[index] = {
      ...teams.teams[index],
      ...updates,
      updated_at: new Date().toISOString()
    }

    await fs.writeFile(TEAMS_FILE, JSON.stringify(teams, null, 2))
    console.log('Team updated successfully:', teams.teams[index])

    return NextResponse.json({ success: true, data: teams.teams[index] })
  } catch (error) {
    console.error('Error updating team:', error)
    return NextResponse.json({ success: false, error: 'Failed to update team' }, { status: 500 })
  }
}

// DELETE : suppression d'une équipe
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDataFile()
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid team ID' }, { status: 400 })
    }

    const data = await fs.readFile(TEAMS_FILE, 'utf8')
    const teams = JSON.parse(data)

    if (!teams.teams) teams.teams = []

    const newTeams = teams.teams.filter((t: any) => t.id !== id)
    if (newTeams.length === teams.teams.length) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 })
    }

    await fs.writeFile(TEAMS_FILE, JSON.stringify({ teams: newTeams }, null, 2))
    console.log('Team deleted successfully, ID:', id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting team:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete team' }, { status: 500 })
  }
}
