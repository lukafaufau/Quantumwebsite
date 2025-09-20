import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const USERS_FILE = path.join(process.cwd(), "data", "users.json")

export async function GET() {
  try {
    console.log("[v0] Loading users from:", USERS_FILE)

    try {
      await fs.access(USERS_FILE)
    } catch {
      // Si le fichier n'existe pas, créer un fichier vide
      const defaultData = { users: [] }
      await fs.mkdir(path.dirname(USERS_FILE), { recursive: true })
      await fs.writeFile(USERS_FILE, JSON.stringify(defaultData, null, 2))
      console.log("[v0] Created default users file")
      return NextResponse.json([])
    }

    const data = await fs.readFile(USERS_FILE, "utf8")
    const users = JSON.parse(data)
    console.log("[v0] Users loaded successfully:", users.users?.length || 0)
    return NextResponse.json(users.users || [])
  } catch (error) {
    console.error("[v0] Error loading users:", error)
    return NextResponse.json({ error: "Erreur lors de la lecture des utilisateurs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Creating new user")
    const userData = await request.json()

    let users
    try {
      const data = await fs.readFile(USERS_FILE, "utf8")
      users = JSON.parse(data)
    } catch {
      users = { users: [] }
      await fs.mkdir(path.dirname(USERS_FILE), { recursive: true })
    }

    const newUser = {
      id: Math.max(...(users.users?.map((u: any) => u.id) || [0]), 0) + 1,
      ...userData,
      created_at: new Date().toISOString(),
      status: userData.status || "active",
    }

    if (!users.users) {
      users.users = []
    }
    users.users.push(newUser)
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))

    console.log("[v0] User created successfully:", newUser.id)
    return NextResponse.json(newUser)
  } catch (error) {
    console.error("[v0] Error creating user:", error)
    return NextResponse.json({ error: "Erreur lors de la création de l'utilisateur" }, { status: 500 })
  }
}
