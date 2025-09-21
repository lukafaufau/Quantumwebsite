import { NextResponse } from "next/server"

// Endpoint d'authentification pour Netlify
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    
    // Utilisateurs mockés pour le déploiement
    const users = [
      {
        id: 1,
        username: "Wayzze",
        email: "wayzze@Nemesis.gg",
        role: "admin",
        discord_id: "Wayzze#0001",
      },
      {
        id: 2,
        username: "16k",
        email: "16k@Nemesis.gg",
        role: "developer",
        discord_id: "16k#0002",
      },
    ]
    
    const user = users.find((u) => u.username === username || u.email === username)
    
    if (user && password === "password") {
      return NextResponse.json({ success: true, user })
    }
    
    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}