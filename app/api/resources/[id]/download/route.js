import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { trackDownload, getResourceById } from '@/lib/resources'

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Please login to download' },
        { status: 401 }
      )
    }

    const resourceId = params.id
    const userId = session.user.id
    
    // Track download (checks for duplicate automatically)
    const result = await trackDownload(resourceId, userId)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }
    
    // Get resource info
    const resource = await getResourceById(resourceId)
    
    return NextResponse.json({
      success: true,
      message: 'Download tracked successfully',
      data: {
        download_url: resource.file_url,
        resource_title: resource.title
      }
    })
  } catch (error) {
    console.error('Error tracking download:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to track download' },
      { status: 500 }
    )
  }
}
