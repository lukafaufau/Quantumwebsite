import { type NextRequest, NextResponse } from "next/server"
import { JsonManager } from "@/lib/json-manager"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const announcementId = Number.parseInt(params.id)
    const updates = await request.json()

    const explorer = await JsonManager.read("explorer")
    const announcementIndex = explorer.announcements.findIndex((a: any) => a.id === announcementId)

    if (announcementIndex === -1) {
      return NextResponse.json({ error: "Annonce non trouvée" }, { status: 404 })
    }

    explorer.announcements[announcementIndex] = {
      ...explorer.announcements[announcementIndex],
      ...updates,
      id: announcementId,
    }

    await JsonManager.write("explorer", explorer)

    return NextResponse.json({ success: true, announcement: explorer.announcements[announcementIndex] })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const announcementId = Number.parseInt(params.id)

    const explorer = await JsonManager.read("explorer")
    const filteredAnnouncements = explorer.announcements.filter((a: any) => a.id !== announcementId)

    if (explorer.announcements.length === filteredAnnouncements.length) {
      return NextResponse.json({ error: "Annonce non trouvée" }, { status: 404 })
    }

    explorer.announcements = filteredAnnouncements
    await JsonManager.write("explorer", explorer)

    return NextResponse.json({ success: true, message: "Annonce supprimée" })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}
