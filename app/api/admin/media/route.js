import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getMediaFiles, createMedia, updateMedia, deleteMedia } from '@/lib/media'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const media = await getMediaFiles()
    
    return NextResponse.json({
      success: true,
      data: media
    })
  } catch (error) {
    console.error('Error in GET /api/admin/media:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, url, type, alt_text, file_size } = body

    if (!title || !url) {
      return NextResponse.json(
        { success: false, message: 'Title and URL are required' },
        { status: 400 }
      )
    }

    const mediaData = {
      title,
      url,
      type: type || 'image',
      alt_text: alt_text || '',
      file_size: file_size || 0
    }

    const newMedia = await createMedia(mediaData)
    
    return NextResponse.json({
      success: true,
      data: newMedia,
      message: 'Media created successfully'
    })
  } catch (error) {
    console.error('Error in POST /api/admin/media:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create media' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Media ID is required' },
        { status: 400 }
      )
    }

    const updatedMedia = await updateMedia(id, updateData)
    
    return NextResponse.json({
      success: true,
      data: updatedMedia,
      message: 'Media updated successfully'
    })
  } catch (error) {
    console.error('Error in PUT /api/admin/media:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update media' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Media ID is required' },
        { status: 400 }
      )
    }

    await deleteMedia(id)
    
    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully'
    })
  } catch (error) {
    console.error('Error in DELETE /api/admin/media:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete media' },
      { status: 500 }
    )
  }
}
