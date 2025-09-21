import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const ANNOUNCEMENTS_FILE = path.join(process.cwd(), 'data', 'announcements.json')

interface Announcement {
  id: number
  title: string
  description: string
  type: string
  game?: string
  date: string
  author: string
  visible: boolean
  priority: string
}

async function ensureDataFile() {
  try {
    await fs.access(ANNOUNCEMENTS_FILE)
  } catch {
    const defaultData = { announcements: [] }
    await fs.mkdir(path.dirname(ANNOUNCEMENTS_FILE), { recursive: true })
    await fs.writeFile(ANNOUNCEMENTS_FILE, JSON.stringify(defaultData, null, 2))
  }
}

export async function GET() {
  try {
    await ensureDataFile()
    const data = await fs.readFile(ANNOUNCEMENTS_FILE, 'utf8')
    const announcements = JSON.parse(data)
    return NextResponse.json({ success: true, data: announcements.announcements || [] })
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch announcements' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataFile()
    const announcementData = await request.json()
    
    if (!announcementData.title || !announcementData.description) {
      return NextResponse.json({ success: false, error: 'Title and description are required' }, { status: 400 })
    }
    
    const data = await fs.readFile(ANNOUNCEMENTS_FILE, 'utf8')
    const announcements = JSON.parse(data)
    
    const newAnnouncement: Announcement = {
      id: Math.max(...(announcements.announcements?.map((a: any) => a.id) || [0]), 0) + 1,
      title: announcementData.title,
      description: announcementData.description,
      type: announcementData.type || 'general',
      game: announcementData.game,
      date: announcementData.date || new Date().toISOString(),
      author: announcementData.author || 'Admin',
      visible: announcementData.visible !== false,
      priority: announcementData.priority || 'medium'
    }
    
    if (!announcements.announcements) {
      announcements.announcements = []
    }
    announcements.announcements.push(newAnnouncement)
    
    await fs.writeFile(ANNOUNCEMENTS_FILE, JSON.stringify(announcements, null, 2))
    
    return NextResponse.json({ success: true, data: newAnnouncement })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json({ success: false, error: 'Failed to create announcement' }, { status: 500 })
  }
}