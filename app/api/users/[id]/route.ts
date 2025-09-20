import { type NextRequest, NextResponse } from "next/server"
import { JsonManager } from "@/lib/json-manager"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)
    const updates = await request.json()

    const users = await JsonManager.read("users")
    const userIndex = users.findIndex((u: any) => u.id === userId)

    if (userIndex === -1) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Mise à jour des données utilisateur
    users[userIndex] = { ...users[userIndex], ...updates, id: userId }
    await JsonManager.write("users", users)

    return NextResponse.json({ success: true, user: users[userIndex] })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)

    const users = await JsonManager.read("users")
    const filteredUsers = users.filter((u: any) => u.id !== userId)

    if (users.length === filteredUsers.length) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    await JsonManager.write("users", filteredUsers)

    return NextResponse.json({ success: true, message: "Utilisateur supprimé" })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}
