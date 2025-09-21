import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

// Récupérer toutes les équipes
export async function GET() {
  try {
    const teams = await db.getTeams() // Assure-toi que cette fonction retourne bien un tableau
    return NextResponse.json({ success: true, data: teams })
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch teams' }, { status: 500 })
  }
}

// Créer une nouvelle équipe
export async function POST(request: NextRequest) {
  try {
    const teamData = await request.json()

    // Validation des champs obligatoires
    if (!teamData.name || !teamData.captain || !teamData.game) {
      return NextResponse.json(
        { success: false, error: 'Name, captain and game are required' },
        { status: 400 }
      )
    }

    // Préparer la nouvelle équipe
    const newTeam = {
      name: teamData.name,
      captain: teamData.captain,
      game: teamData.game,
      members: teamData.members || [],
      status: teamData.status || 'active',
      createdAt: new Date().toISOString()
    }

    // Ajouter l'équipe à la base
    const createdTeam = await db.addTeam(newTeam)

    return NextResponse.json({ success: true, data: createdTeam })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json({ success: false, error: 'Failed to create team' }, { status: 500 })
  }
}
