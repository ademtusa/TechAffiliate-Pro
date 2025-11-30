import { NextResponse } from 'next/server'
import { getApprovedTestimonials } from '@/lib/testimonials'

// Public API - Get approved testimonials only
export async function GET(request) {
  try {
    const testimonials = await getApprovedTestimonials()
    
    return NextResponse.json({
      success: true,
      data: testimonials
    })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}
