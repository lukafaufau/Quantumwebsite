import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const USERS_FILE = path.join(process.cwd(), "data", "users.json")

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)
    const updateData = await request.json()
    console.log("[v0] Updating user:", userId, updateData)

    const data = await fs.readFile(USERS_FILE, "utf8")
    const users = JSON.parse(data)

    if (!users.users) {
      users.users = []
    }

    const userIndex = users.users.findIndex((u: any) => u.id === userId)
    if (userIndex === -1) {
      console.log("[v0] User not found:", userId)
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    users.users[userIndex] = { ...users.users[userIndex], ...updateData, updated_at: new Date().toISOString() }
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))

    console.log("[v0] User updated successfully:", userId)
    return NextResponse.json(users.users[userIndex])
  } catch (error) {
    console.error("[v0] Error updating user:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)
    console.log("[v0] Deleting user:", userId)

    const data = await fs.readFile(USERS_FILE, "utf8")
    const users = JSON.parse(data)

    if (!users.users) {
      users.users = []
    }

    const initialLength = users.users.length
    users.users = users.users.filter((u: any) => u.id !== userId)

    if (users.users.length === initialLength) {
      console.log("[v0] User not found for deletion:", userId)
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))

    console.log("[v0] User deleted successfully:", userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting user:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}
