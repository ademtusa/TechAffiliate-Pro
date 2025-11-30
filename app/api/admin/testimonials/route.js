import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import {
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial,
  rejectTestimonial
} from '@/lib/testimonials'

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
    const status = searchParams.get('status')
    
    const filters = {}
    if (status) filters.status = status
    
    const testimonials = await getAllTestimonials(filters)
    
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

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const testimonialData = await request.json()
    
    if (!testimonialData.name || !testimonialData.content) {
      return NextResponse.json(
        { success: false, message: 'Name and content are required' },
        { status: 400 }
      )
    }
    
    const newTestimonial = await createTestimonial(testimonialData)
    
    return NextResponse.json({
      success: true,
      message: 'Testimonial created successfully',
      data: newTestimonial
    })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create testimonial' },
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

    const { id, action, ...updateData } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Testimonial ID required' },
        { status: 400 }
      )
    }
    
    let updatedTestimonial
    
    if (action === 'approve') {
      updatedTestimonial = await approveTestimonial(id)
    } else if (action === 'reject') {
      updatedTestimonial = await rejectTestimonial(id)
    } else {
      updatedTestimonial = await updateTestimonial(id, updateData)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: updatedTestimonial
    })
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update testimonial' },
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
    const testimonialId = searchParams.get('id')
    
    if (!testimonialId) {
      return NextResponse.json(
        { success: false, message: 'Testimonial ID required' },
        { status: 400 }
      )
    }
    
    await deleteTestimonial(testimonialId)
    
    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}
