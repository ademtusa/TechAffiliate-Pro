import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserResources } from '@/lib/user-stats'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const resources = await getUserResources(session.user.email)
    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error in user resources API:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
