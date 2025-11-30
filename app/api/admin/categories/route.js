import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { 
  createCategory, 
  getAllCategories, 
  updateCategory, 
  deleteCategory,
  getCategoryStats
} from '@/lib/categories'

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
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const withStats = searchParams.get('withStats') === 'true'
    
    const filters = {}
    if (type) filters.type = type
    if (status) filters.status = status
    if (search) filters.search = search
    
    let categories = await getAllCategories(filters)
    
    // Add item counts if requested
    if (withStats) {
      categories = await Promise.all(
        categories.map(async (cat) => await getCategoryStats(cat.id))
      )
    }
    
    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories' },
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

    const categoryData = await request.json()
    
    // Validation
    if (!categoryData.name || !categoryData.type) {
      return NextResponse.json(
        { success: false, message: 'Name and type are required' },
        { status: 400 }
      )
    }
    
    if (!['product', 'resource'].includes(categoryData.type)) {
      return NextResponse.json(
        { success: false, message: 'Type must be "product" or "resource"' },
        { status: 400 }
      )
    }
    
    const newCategory = await createCategory(categoryData)
    
    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create category' },
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
        { success: false, message: 'Category ID required' },
        { status: 400 }
      )
    }
    
    const updatedCategory = await updateCategory(id, updateData)
    
    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update category' },
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
    const categoryId = searchParams.get('id')
    
    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: 'Category ID required' },
        { status: 400 }
      )
    }
    
    await deleteCategory(categoryId)
    
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete category' },
      { status: 500 }
    )
  }
}
