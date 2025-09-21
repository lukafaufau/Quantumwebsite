import { type NextRequest, NextResponse } from "next/server"
import { JsonManager } from "@/lib/json-manager"

export async function GET() {
  try {
    const recruitments = await JsonManager.getRecruitments()
    return NextResponse.json({ success: true, data: recruitments })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch recruitments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newRecruitment = {
      username: body.username,
      discord_id: body.discord_id,
      role: body.role,
      game: body.game,
      status: "pending",
      message: body.message,
      experience: body.experience,
      availability: body.availability,
      date: new Date().toISOString().split("T")[0],
    }

    const success = await JsonManager.addRecruitment(newRecruitment)

    if (success) {
      return NextResponse.json({ success: true, message: "Application submitted successfully" })
    } else {
      return NextResponse.json({ success: false, error: "Failed to submit application" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid request data" }, { status: 400 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const success = await JsonManager.updateRecruitment(id, { status })

    if (success) {
      return NextResponse.json({ success: true, message: "Application updated successfully" })
    } else {
      return NextResponse.json({ success: false, error: "Failed to update application" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid request data" }, { status: 400 })
  }
}
