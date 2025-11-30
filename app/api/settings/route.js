import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/settings'

// Public endpoint - no auth required
export async function GET(request) {
  try {
    const settings = await getSettings()
    
    // Remove sensitive data
    const { _id, created_at, updated_at, ...publicSettings } = settings
    
    return NextResponse.json({
      success: true,
      data: publicSettings
    })
  } catch (error) {
    console.error('Error fetching public settings:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}
