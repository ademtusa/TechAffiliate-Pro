import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getDatabase } from '@/lib/mongodb'
import { updateUserStatus } from '@/lib/auth'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const db = await getDatabase()
    const users = db.collection('users')
    
    const allUsers = await users.find(
      {},
      { projection: { password: 0 } }
    ).sort({ created_at: -1 }).toArray()
    
    console.log('✅ Found users:', allUsers.length)
    allUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role} - ${user.status}`)
    })
    
    return NextResponse.json({
      success: true,
      data: allUsers
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
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

    const { userId, status, role } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID required' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const users = db.collection('users')
    
    const updateData = {}
    if (status) updateData.status = status
    if (role) updateData.role = role
    updateData.updated_at = new Date().toISOString()
    
    await users.updateOne(
      { id: userId },
      { $set: updateData }
    )
    
    const updatedUser = await users.findOne({ id: userId }, { projection: { password: 0 } })
    
    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
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
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID required' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const users = db.collection('users')
    
    await users.deleteOne({ id: userId })
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    )
  }
}