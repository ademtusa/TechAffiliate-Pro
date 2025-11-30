import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { 
  createResource, 
  getAllResources, 
  updateResource, 
  deleteResource 
} from '@/lib/resources'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    
    const filters = {}
    if (search) filters.search = search
    if (category) filters.category = category
    if (status) filters.status = status
    if (type) filters.type = type
    
    const resources = await getAllResources(filters)
    
    return NextResponse.json({
      success: true,
      data: resources
    })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resourceData = await request.json()
    
    // Validation
    if (!resourceData.title || !resourceData.category) {
      return NextResponse.json(
        { success: false, message: 'Title and category are required' },
        { status: 400 }
      )
    }
    
    const newResource = await createResource(resourceData)
    
    return NextResponse.json({
      success: true,
      message: 'Resource created successfully',
      data: newResource
    })
  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create resource' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id, ...updateData } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Resource ID required' },
        { status: 400 }
      )
    }
    
    const updatedResource = await updateResource(id, updateData)
    
    return NextResponse.json({
      success: true,
      message: 'Resource updated successfully',
      data: updatedResource
    })
  } catch (error) {
    console.error('Error updating resource:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update resource' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const resourceId = searchParams.get('id')
    
    if (!resourceId) {
      return NextResponse.json(
        { success: false, message: 'Resource ID required' },
        { status: 400 }
      )
    }
    
    await deleteResource(resourceId)
    
    return NextResponse.json({
      success: true,
      message: 'Resource deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete resource' },
      { status: 500 }
    )
  }
}
