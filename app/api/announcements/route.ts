import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET() {
  try {
    const announcements = await db.getAnnouncements()
    return NextResponse.json({ success: true, data: announcements })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch announcements' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const announcementData = await request.json()
    const newAnnouncement = await db.addAnnouncement({
      ...announcementData,
      date: new Date().toISOString(),
      visible: announcementData.visible !== false,
      priority: announcementData.priority || 'medium'
    })
    return NextResponse.json({ success: true, data: newAnnouncement })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create announcement' }, { status: 500 })
  }
}