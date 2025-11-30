import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getResourceById, trackDownload } from '@/lib/resources'
import { addUserResource } from '@/lib/user-stats'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Please login to download resources' },
        { status: 401 }
      )
    }

    // Check if user is approved
    if (session.user.status !== 'approved') {
      return NextResponse.json(
        { success: false, message: 'Your account is pending approval. Please wait for admin approval.' },
        { status: 403 }
      )
    }

    const { resourceId } = await request.json()
    
    if (!resourceId) {
      return NextResponse.json(
        { success: false, message: 'Resource ID required' },
        { status: 400 }
      )
    }

    // Get resource details
    const resource = await getResourceById(resourceId)
    
    if (!resource) {
      return NextResponse.json(
        { success: false, message: 'Resource not found' },
        { status: 404 }
      )
    }

    if (resource.status !== 'published') {
      return NextResponse.json(
        { success: false, message: 'Resource is not available' },
        { status: 403 }
      )
    }

    // Track download (includes 1 per category rule)
    const trackResult = await trackDownload(resourceId, session.user.id)
    
    if (!trackResult.success) {
      return NextResponse.json(
        { success: false, message: trackResult.message, category: trackResult.category },
        { status: 400 }
      )
    }

    // Add to user's downloaded resources
    await addUserResource(session.user.email, resourceId)

    // Return success with file URL for download
    return NextResponse.json({
      success: true,
      message: 'Download started',
      file_url: resource.file_url,
      resource: {
        id: resource.id,
        title: resource.title,
        category: resource.category,
        type: resource.type
      }
    })
  } catch (error) {
    console.error('Error processing download:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process download' },
      { status: 500 }
    )
  }
}
