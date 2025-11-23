import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Initialize Supabase tables (run once)
export async function GET(request) {
  const url = new URL(request.url)
  const pathname = url.pathname.replace('/api', '')

  try {
    // Get products
    if (pathname === '/products' || pathname === '/products/') {
      const category = url.searchParams.get('category')
      const sort = url.searchParams.get('sort')
      const search = url.searchParams.get('search')

      let query = supabase.from('products').select('*')

      if (category && category !== 'all') {
        query = query.eq('category', category)
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
      }

      if (sort === 'bestsellers') {
        query = query.order('sales_count', { ascending: false })
      } else if (sort === 'mostviewed') {
        query = query.order('views', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    // Get single product
    if (pathname.startsWith('/products/')) {
      const id = pathname.split('/').pop()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      // Increment views
      await supabase
        .from('products')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id)

      return NextResponse.json({ success: true, data })
    }

    // Get categories
    if (pathname === '/categories' || pathname === '/categories/') {
      const { data, error } = await supabase.from('categories').select('*').order('name')
      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    // Get blog posts
    if (pathname === '/blog' || pathname === '/blog/') {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, products(*)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    // Get single blog post
    if (pathname.startsWith('/blog/')) {
      const slug = pathname.split('/').pop()
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, products(*)')
        .eq('slug', slug)
        .single()
      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    // Get reviews for a product
    if (pathname.startsWith('/reviews/')) {
      const productId = pathname.split('/').pop()
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    // Get free resources
    if (pathname === '/resources' || pathname === '/resources/') {
      const { data, error } = await supabase
        .from('free_resources')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    // Get user profile
    if (pathname === '/profile' || pathname === '/profile/') {
      const userId = url.searchParams.get('userId')
      if (!userId) {
        return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 })
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({ user_id: userId, saved_products: [], preferences: {} })
          .select()
          .single()
        
        if (createError) throw createError
        return NextResponse.json({ success: true, data: newProfile })
      }

      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    // Get analytics (admin)
    if (pathname === '/analytics' || pathname === '/analytics/') {
      const { data: products, error: prodError } = await supabase
        .from('products')
        .select('id, name, views, sales_count')
      
      const { data: users, error: userError } = await supabase
        .from('user_profiles')
        .select('id')

      const { data: reviews, error: reviewError } = await supabase
        .from('reviews')
        .select('id')

      if (prodError || userError || reviewError) {
        throw prodError || userError || reviewError
      }

      return NextResponse.json({
        success: true,
        data: {
          products: products || [],
          totalUsers: users?.length || 0,
          totalReviews: reviews?.length || 0,
          totalViews: products?.reduce((sum, p) => sum + (p.views || 0), 0) || 0
        }
      })
    }

    // Get related products
    if (pathname === '/related' || pathname === '/related/') {
      const category = url.searchParams.get('category')
      const excludeId = url.searchParams.get('excludeId')

      let query = supabase.from('products').select('*').limit(4)

      if (category) {
        query = query.eq('category', category)
      }

      if (excludeId) {
        query = query.neq('id', excludeId)
      }

      const { data, error } = await query
      if (error) throw error
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
      const { data, error } = await supabase
        .from('products')
        .insert(body)
        .select()
        .single()
      
      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    // Add review
    if (pathname === '/reviews' || pathname === '/reviews/') {
      const { data, error } = await supabase
        .from('reviews')
        .insert(body)
        .select()
        .single()
      
      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    // Add blog post
    if (pathname === '/blog' || pathname === '/blog/') {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(body)
        .select()
        .single()
      
      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    // Save product (user)
    if (pathname === '/save-product' || pathname === '/save-product/') {
      const { userId, productId } = body
      
      const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('saved_products')
        .eq('user_id', userId)
        .single()

      if (fetchError) throw fetchError

      const savedProducts = profile.saved_products || []
      if (!savedProducts.includes(productId)) {
        savedProducts.push(productId)
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ saved_products: savedProducts })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    // Track affiliate click
    if (pathname === '/track-click' || pathname === '/track-click/') {
      const { productId } = body
      
      const { data: product } = await supabase
        .from('products')
        .select('sales_count')
        .eq('id', productId)
        .single()

      await supabase
        .from('products')
        .update({ sales_count: (product?.sales_count || 0) + 1 })
        .eq('id', productId)

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
      const { data, error } = await supabase
        .from('products')
        .update(body)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    // Update profile
    if (pathname === '/profile' || pathname === '/profile/') {
      const { userId, ...updates } = body
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) throw error
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
      const id = pathname.split('/').pop()
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return NextResponse.json({ success: true })
    }

    // Delete review
    if (pathname.startsWith('/reviews/')) {
      const id = pathname.split('/').pop()
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: 'Endpoint not found' }, { status: 404 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}