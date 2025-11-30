import { NextResponse } from 'next/server'
import { createMessage } from '@/lib/messages'

export async function POST(request) {
  try {
    const data = await request.json()
    
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required' },
        { status: 400 }
      )
    }
    
    await createMessage(data)
    
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to send message' },
      { status: 500 }
    )
  }
}
