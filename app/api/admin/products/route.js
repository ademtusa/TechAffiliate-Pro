import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { createProduct, getAllProducts, updateProduct, deleteProduct } from '@/lib/products'

export async function GET(request) {
  try {
    const session = await getServerSession()
    
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
    
    const filters = {}
    if (search) filters.search = search
    if (category) filters.category = category
    if (status) filters.status = status
    
    const products = await getAllProducts(filters)
    
    return NextResponse.json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession()
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const productData = await request.json()
    
    // Validation
    if (!productData.title || !productData.category) {
      return NextResponse.json(
        { success: false, message: 'Title and category are required' },
        { status: 400 }
      )
    }
    
    const newProduct = await createProduct(productData)
    
    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create product' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession()
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id, ...updateData } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Product ID required' },
        { status: 400 }
      )
    }
    
    const updatedProduct = await updateProduct(id, updateData)
    
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession()
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')
    
    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID required' },
        { status: 400 }
      )
    }
    
    await deleteProduct(productId)
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete product' },
      { status: 500 }
    )
  }
}