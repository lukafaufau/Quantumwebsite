import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const ANNOUNCEMENTS_FILE = path.join(process.cwd(), 'data', 'announcements.json')

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const updates = await request.json()
    
    const data = await fs.readFile(ANNOUNCEMENTS_FILE, 'utf8')
    const announcements = JSON.parse(data)
    
    if (!announcements.announcements) {
      announcements.announcements = []
    }
    
    const announcementIndex = announcements.announcements.findIndex((a: any) => a.id === id)
    if (announcementIndex === -1) {
      return NextResponse.json({ success: false, error: 'Announcement not found' }, { status: 404 })
    }
    
    announcements.announcements[announcementIndex] = {
      ...announcements.announcements[announcementIndex],
      ...updates
    }
    
    await fs.writeFile(ANNOUNCEMENTS_FILE, JSON.stringify(announcements, null, 2))
    
    return NextResponse.json({ success: true, data: announcements.announcements[announcementIndex] })
  } catch (error) {
    console.error('Error updating announcement:', error)
    return NextResponse.json({ success: false, error: 'Failed to update announcement' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    
    const data = await fs.readFile(ANNOUNCEMENTS_FILE, 'utf8')
    const announcements = JSON.parse(data)
    
    if (!announcements.announcements) {
      announcements.announcements = []
    }
    
    const initialLength = announcements.announcements.length
    announcements.announcements = announcements.announcements.filter((a: any) => a.id !== id)
    
    if (announcements.announcements.length === initialLength) {
      return NextResponse.json({ success: false, error: 'Announcement not found' }, { status: 404 })
    }
    
    await fs.writeFile(ANNOUNCEMENTS_FILE, JSON.stringify(announcements, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting announcement:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete announcement' }, { status: 500 })
  }
}