import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET() {
  try {
    const applications = await db.getRecruitments()
    return NextResponse.json({ success: true, data: applications })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch applications' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json()
    
    if (!applicationData.username || !applicationData.discord_id || !applicationData.role || !applicationData.game) {
      return NextResponse.json({ success: false, error: 'Tous les champs obligatoires doivent être remplis' }, { status: 400 })
    }
    
    const newApplication = await db.addRecruitment({
      ...applicationData,
      status: 'pending',
      date: new Date().toISOString()
    })
    return NextResponse.json({ success: true, data: newApplication })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json({ success: false, error: 'Failed to create application' }, { status: 500 })
  }
}