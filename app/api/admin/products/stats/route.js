import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getProductStats } from '@/lib/products'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const stats = await getProductStats()
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching product stats:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
