import { NextResponse } from 'next/server'
import { getPublishedResources } from '@/lib/resources'

// Public endpoint - returns only published resources
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    
    const filters = {}
    if (category) filters.category = category
    if (type) filters.type = type
    
    const resources = await getPublishedResources(filters)
    
    return NextResponse.json({
      success: true,
      data: resources
    })
  } catch (error) {
    console.error('Error fetching public resources:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}
