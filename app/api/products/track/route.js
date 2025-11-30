import { NextResponse } from 'next/server'
import { incrementViewCount, incrementClickCount } from '@/lib/products'

export async function POST(request) {
  try {
    const { productId, type } = await request.json()
    
    if (!productId || !type) {
      return NextResponse.json(
        { success: false, message: 'Product ID and type required' },
        { status: 400 }
      )
    }

    if (type === 'view') {
      await incrementViewCount(productId)
    } else if (type === 'click') {
      await incrementClickCount(productId)
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid type. Use "view" or "click"' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `${type} tracked successfully`
    })
  } catch (error) {
    console.error('Error tracking:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to track' },
      { status: 500 }
    )
  }
}
