import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

// Mettre à jour une équipe
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid team ID' }, { status: 400 })
    }

    const updates = await request.json()
    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid update data' }, { status: 400 })
    }

    const updatedTeam = await db.updateTeam(id, updates)

    if (!updatedTeam) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedTeam })
  } catch (error) {
    console.error('Error updating team:', error)
    return NextResponse.json({ success: false, error: 'Failed to update team' }, { status: 500 })
  }
}

// Supprimer une équipe
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid team ID' }, { status: 400 })
    }

    const deleted = await db.deleteTeam(id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Team deleted successfully' })
  } catch (error) {
    console.error('Error deleting team:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete team' }, { status: 500 })
  }
}
