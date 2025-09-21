import { type NextRequest, NextResponse } from "next/server"
import { JsonManager } from "@/lib/json-manager"

export async function GET() {
  try {
    const announcements = await JsonManager.getAnnouncements()
    return NextResponse.json({ success: true, data: announcements })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch announcements" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newAnnouncement = {
      title: body.title,
      description: body.description,
      type: body.type,
      game: body.game || null,
      date: new Date().toISOString().split("T")[0],
    }

    const success = await JsonManager.addAnnouncement(newAnnouncement)

    if (success) {
      return NextResponse.json({ success: true, message: "Announcement created successfully" })
    } else {
      return NextResponse.json({ success: false, error: "Failed to create announcement" }, { status: 500 })
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
      return NextResponse.json({ success: false, error: "Missing announcement ID" }, { status: 400 })
    }

    const success = await JsonManager.updateAnnouncement(id, updates)

    if (success) {
      return NextResponse.json({ success: true, message: "Announcement updated successfully" })
    } else {
      return NextResponse.json({ success: false, error: "Failed to update announcement" }, { status: 500 })
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
      return NextResponse.json({ success: false, error: "Missing announcement ID" }, { status: 400 })
    }

    const success = await JsonManager.deleteAnnouncement(Number.parseInt(id))

    if (success) {
      return NextResponse.json({ success: true, message: "Announcement deleted successfully" })
    } else {
      return NextResponse.json({ success: false, error: "Failed to delete announcement" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  }
}
