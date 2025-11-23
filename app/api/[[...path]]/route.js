import { NextResponse } from 'next/server'
import { mockCategories, mockProducts, mockBlogPosts, mockReviews, mockResources } from '@/lib/mockData'

// Using mock data - website works immediately without Supabase setup!
// To use real Supabase data, run the supabase-setup.sql script and set useMockData = false

const useMockData = true

export async function GET(request) {
  const url = new URL(request.url)
  const pathname = url.pathname.replace('/api', '')

  try {
    // Get products
    if (pathname === '/products' || pathname === '/products/') {
      const category = url.searchParams.get('category')
      const sort = url.searchParams.get('sort')
      const search = url.searchParams.get('search')

      let data = [...mockProducts]

      // Filter by category
      if (category && category !== 'all') {
        data = data.filter(p => p.category === category)
      }

      // Filter by search
      if (search) {
        const searchLower = search.toLowerCase()
        data = data.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower)
        )
      }

      // Sort
      if (sort === 'bestsellers') {
        data.sort((a, b) => b.sales_count - a.sales_count)
      } else if (sort === 'mostviewed') {
        data.sort((a, b) => b.views - a.views)
      } else {
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }

      return NextResponse.json({ success: true, data })
    }

    // Get single product
    if (pathname.startsWith('/products/')) {
      const id = pathname.split('/').pop()
      const data = mockProducts.find(p => p.id === id)

      if (!data) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
      }

      // Increment views (in mock, just return the product)
      return NextResponse.json({ success: true, data })
    }

    // Get categories
    if (pathname === '/categories' || pathname === '/categories/') {
      return NextResponse.json({ success: true, data: mockCategories })
    }

    // Get blog posts
    if (pathname === '/blog' || pathname === '/blog/') {
      const data = mockBlogPosts.map(post => {
        const product = mockProducts.find(p => p.id === post.product_id)
        return {
          ...post,
          products: product || null
        }
      })
      return NextResponse.json({ success: true, data })
    }

    // Get single blog post
    if (pathname.startsWith('/blog/')) {
      const slug = pathname.split('/').pop()
      const post = mockBlogPosts.find(p => p.slug === slug)
      
      if (!post) {
        return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 })
      }

      const product = mockProducts.find(p => p.id === post.product_id)
      const data = {
        ...post,
        products: product || null
      }
      
      return NextResponse.json({ success: true, data })
    }

    // Get reviews for a product
    if (pathname.startsWith('/reviews/')) {
      const productId = pathname.split('/').pop()
      const data = mockReviews.filter(r => r.product_id === productId)
      return NextResponse.json({ success: true, data })
    }

    // Get free resources
    if (pathname === '/resources' || pathname === '/resources/') {
      return NextResponse.json({ success: true, data: mockResources })
    }

    // Get user profile
    if (pathname === '/profile' || pathname === '/profile/') {
      const userId = url.searchParams.get('userId')
      if (!userId) {
        return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 })
      }

      // Mock profile data
      const data = {
        id: '1',
        user_id: userId,
        saved_products: [],
        preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      return NextResponse.json({ success: true, data })
    }

    // Get analytics (admin)
    if (pathname === '/analytics' || pathname === '/analytics/') {
      const data = {
        products: mockProducts.map(p => ({
          id: p.id,
          name: p.name,
          views: p.views,
          sales_count: p.sales_count
        })),
        totalUsers: 42,
        totalReviews: mockReviews.length,
        totalViews: mockProducts.reduce((sum, p) => sum + p.views, 0)
      }

      return NextResponse.json({ success: true, data })
    }

    // Get related products
    if (pathname === '/related' || pathname === '/related/') {
      const category = url.searchParams.get('category')
      const excludeId = url.searchParams.get('excludeId')

      let data = [...mockProducts]

      if (category) {
        data = data.filter(p => p.category === category)
      }

      if (excludeId) {
        data = data.filter(p => p.id !== excludeId)
      }

      data = data.slice(0, 4)

      return NextResponse.json({ success: true, data })
    }

    return NextResponse.json({ success: false, error: 'Endpoint not found' }, { status: 404 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  const url = new URL(request.url)
  const pathname = url.pathname.replace('/api', '')

  try {
    const body = await request.json()

    // Add product (admin)
    if (pathname === '/products' || pathname === '/products/') {
      // In mock mode, just return success
      const newProduct = {
        ...body,
        id: String(mockProducts.length + 1),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      return NextResponse.json({ success: true, data: newProduct })
    }

    // Add review
    if (pathname === '/reviews' || pathname === '/reviews/') {
      const newReview = {
        ...body,
        id: String(mockReviews.length + 1),
        created_at: new Date().toISOString()
      }
      
      return NextResponse.json({ success: true, data: newReview })
    }

    // Add blog post
    if (pathname === '/blog' || pathname === '/blog/') {
      const newPost = {
        ...body,
        id: String(mockBlogPosts.length + 1),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      return NextResponse.json({ success: true, data: newPost })
    }

    // Save product (user)
    if (pathname === '/save-product' || pathname === '/save-product/') {
      // Mock: just return success
      return NextResponse.json({ success: true, data: { saved_products: [body.productId] } })
    }

    // Track affiliate click
    if (pathname === '/track-click' || pathname === '/track-click/') {
      // Mock: just return success
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: 'Endpoint not found' }, { status: 404 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  const url = new URL(request.url)
  const pathname = url.pathname.replace('/api', '')

  try {
    const body = await request.json()

    // Update product
    if (pathname.startsWith('/products/')) {
      const id = pathname.split('/').pop()
      const product = mockProducts.find(p => p.id === id)
      
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
      }

      const updatedProduct = {
        ...product,
        ...body,
        updated_at: new Date().toISOString()
      }
      
      return NextResponse.json({ success: true, data: updatedProduct })
    }

    // Update profile
    if (pathname === '/profile' || pathname === '/profile/') {
      // Mock: just return success with updated data
      const data = {
        ...body,
        updated_at: new Date().toISOString()
      }
      
      return NextResponse.json({ success: true, data })
    }

    return NextResponse.json({ success: false, error: 'Endpoint not found' }, { status: 404 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  const url = new URL(request.url)
  const pathname = url.pathname.replace('/api', '')

  try {
    // Delete product
    if (pathname.startsWith('/products/')) {
      // Mock: just return success
      return NextResponse.json({ success: true })
    }

    // Delete review
    if (pathname.startsWith('/reviews/')) {
      // Mock: just return success
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: 'Endpoint not found' }, { status: 404 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
