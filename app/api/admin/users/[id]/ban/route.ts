import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const USERS_FILE = path.join(process.cwd(), "data", "users.json")

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)
    const { reason } = await request.json()
    console.log("[v0] Banning user:", userId, "Reason:", reason)

    const data = await fs.readFile(USERS_FILE, "utf8")
    const users = JSON.parse(data)

    if (!users.users) {
      users.users = []
    }

    const userIndex = users.users.findIndex((u: any) => u.id === userId)
    if (userIndex === -1) {
      console.log("[v0] User not found for ban:", userId)
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    users.users[userIndex] = {
      ...users.users[userIndex],
      status: "banned",
      ban_reason: reason,
      banned_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))

    console.log("[v0] User banned successfully:", userId)
    return NextResponse.json({ success: true, user: users.users[userIndex] })
  } catch (error) {
    console.error("[v0] Error banning user:", error)
    return NextResponse.json({ error: "Erreur lors du bannissement" }, { status: 500 })
  }
}
