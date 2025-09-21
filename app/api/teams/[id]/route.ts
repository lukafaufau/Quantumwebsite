import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const TEAMS_FILE = path.join(process.cwd(), 'data', 'teams.json')

// PUT : mise à jour d'une équipe
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid team ID' }, { status: 400 })
    }

    const updates = await request.json()
    console.log('Updates received:', updates) // Debug

    const data = await fs.readFile(TEAMS_FILE, 'utf8')
    const teams = JSON.parse(data)

    if (!teams.teams) teams.teams = []

    const teamIndex = teams.teams.findIndex((t: any) => t.id === id)
    if (teamIndex === -1) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 })
    }

    teams.teams[teamIndex] = {
      ...teams.teams[teamIndex],
      ...updates,
      updated_at: new Date().toISOString()
    }

    await fs.writeFile(TEAMS_FILE, JSON.stringify(teams, null, 2))
    console.log('Team updated successfully:', teams.teams[teamIndex])

    return NextResponse.json({ success: true, data: teams.teams[teamIndex] })
  } catch (error) {
    console.error('Error updating team:', error)
    return NextResponse.json({ success: false, error: 'Failed to update team' }, { status: 500 })
  }
}

// DELETE : suppression d'une équipe
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid team ID' }, { status: 400 })
    }

    const data = await fs.readFile(TEAMS_FILE, 'utf8')
    const teams = JSON.parse(data)

    if (!teams.teams) teams.teams = []

    const initialLength = teams.teams.length
    teams.teams = teams.teams.filter((t: any) => t.id !== id)

    if (teams.teams.length === initialLength) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 })
    }

    await fs.writeFile(TEAMS_FILE, JSON.stringify(teams, null, 2))
    console.log('Team deleted successfully, ID:', id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting team:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete team' }, { status: 500 })
  }
}
