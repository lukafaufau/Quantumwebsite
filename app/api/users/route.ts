import { type NextRequest, NextResponse } from "next/server"
import { JsonManager } from "@/lib/json-manager"

export async function GET() {
  try {
    const users = await JsonManager.getUsers()
    // Remove password field from response
    const safeUsers = users.map(({ password, ...user }: any) => user)
    return NextResponse.json({ success: true, data: safeUsers })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newUser = {
      username: body.username,
      email: body.email,
      password: "hashed_password", // In real app, hash the password
      role: body.role || "player",
      discord_id: body.discord_id,
    }

    const success = await JsonManager.addUser(newUser)

    if (success) {
      return NextResponse.json({ success: true, message: "User created successfully" })
    } else {
      return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid request data" }, { status: 400 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing user ID" }, { status: 400 })
    }

    // Don't allow password updates through this endpoint
    delete updates.password

    const success = await JsonManager.updateUser(id, updates)

    if (success) {
      return NextResponse.json({ success: true, message: "User updated successfully" })
    } else {
      return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid request data" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing user ID" }, { status: 400 })
    }

    const success = await JsonManager.deleteUser(Number.parseInt(id))

    if (success) {
      return NextResponse.json({ success: true, message: "User deleted successfully" })
    } else {
      return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  }
}
