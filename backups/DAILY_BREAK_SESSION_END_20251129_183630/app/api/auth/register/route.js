import { NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, password, name } = await request.json()
    
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }
    
    const user = await createUser(email, password, name)
    
    return NextResponse.json({
      success: true,
      message: 'Registration successful! Your account is pending approval.',
      data: user
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Registration failed' },
      { status: 400 }
    )
  }
}