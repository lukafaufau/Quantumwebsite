import { type NextRequest, NextResponse } from "next/server"
import { JsonManager } from "@/lib/json-manager"

export async function GET() {
  try {
    const teams = await JsonManager.getTeams()
    return NextResponse.json({ success: true, data: teams })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch teams" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newTeam = {
      name: body.name,
      captain: body.captain,
      members: body.members || [],
      game: body.game,
      description: body.description || "",
    }

    const success = await JsonManager.addTeam(newTeam)

    if (success) {
      return NextResponse.json({ success: true, message: "Team created successfully" })
    } else {
      return NextResponse.json({ success: false, error: "Failed to create team" }, { status: 500 })
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
      return NextResponse.json({ success: false, error: "Missing team ID" }, { status: 400 })
    }

    const success = await JsonManager.updateTeam(id, updates)

    if (success) {
      return NextResponse.json({ success: true, message: "Team updated successfully" })
    } else {
      return NextResponse.json({ success: false, error: "Failed to update team" }, { status: 500 })
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
      return NextResponse.json({ success: false, error: "Missing team ID" }, { status: 400 })
    }

    const success = await JsonManager.deleteTeam(Number.parseInt(id))

    if (success) {
      return NextResponse.json({ success: true, message: "Team deleted successfully" })
    } else {
      return NextResponse.json({ success: false, error: "Failed to delete team" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  }
}
