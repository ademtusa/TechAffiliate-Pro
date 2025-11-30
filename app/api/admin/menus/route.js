import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getMenus, createMenu, updateMenu, deleteMenu } from '@/lib/menus'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const menus = await getMenus()
    
    return NextResponse.json({
      success: true,
      data: menus
    })
  } catch (error) {
    console.error('Error in GET /api/admin/menus:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch menus' },
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
    const { label, url, order, target, is_active } = body

    if (!label || !url) {
      return NextResponse.json(
        { success: false, message: 'Label and URL are required' },
        { status: 400 }
      )
    }

    const menuData = {
      label,
      url,
      order: order || 0,
      target: target || '_self',
      is_active: is_active !== undefined ? is_active : true
    }

    const newMenu = await createMenu(menuData)
    
    return NextResponse.json({
      success: true,
      data: newMenu,
      message: 'Menu created successfully'
    })
  } catch (error) {
    console.error('Error in POST /api/admin/menus:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create menu' },
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
        { success: false, message: 'Menu ID is required' },
        { status: 400 }
      )
    }

    const updatedMenu = await updateMenu(id, updateData)
    
    return NextResponse.json({
      success: true,
      data: updatedMenu,
      message: 'Menu updated successfully'
    })
  } catch (error) {
    console.error('Error in PUT /api/admin/menus:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update menu' },
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
        { success: false, message: 'Menu ID is required' },
        { status: 400 }
      )
    }

    await deleteMenu(id)
    
    return NextResponse.json({
      success: true,
      message: 'Menu deleted successfully'
    })
  } catch (error) {
    console.error('Error in DELETE /api/admin/menus:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete menu' },
      { status: 500 }
    )
  }
}
