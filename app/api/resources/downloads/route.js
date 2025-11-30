import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getDatabase } from '@/lib/mongodb'

// Get user's downloads
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const db = await getDatabase()
    const downloads = db.collection('resource_downloads')
    
    const userDownloads = await downloads.find({
      user_id: session.user.id
    }).toArray()
    
    return NextResponse.json({
      success: true,
      data: userDownloads
    })
  } catch (error) {
    console.error('Error fetching user downloads:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch downloads' },
      { status: 500 }
    )
  }
}
