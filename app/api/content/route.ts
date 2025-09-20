import { type NextRequest, NextResponse } from "next/server"
import { contentManager } from "@/lib/content-manager"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page")

    if (page) {
      const content = await contentManager.getPageContent(page)
      return NextResponse.json(content)
    }

    const allContent = await contentManager.getContent()
    return NextResponse.json(allContent)
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération du contenu" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { page, content } = await request.json()

    if (!page || !content) {
      return NextResponse.json({ error: "Page et contenu requis" }, { status: 400 })
    }

    await contentManager.updatePageContent(page, content)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour du contenu" }, { status: 500 })
  }
}
