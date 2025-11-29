import { getDatabase } from './mongodb'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

export async function createUser(email, password, name) {
  const db = await getDatabase()
  const users = db.collection('users')
  
  // Check if user exists
  const existingUser = await users.findOne({ email })
  if (existingUser) {
    throw new Error('User already exists')
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)
  
  // Create user
  const newUser = {
    id: uuidv4(),
    email,
    password: hashedPassword,
    name,
    role: 'user', // 'user' or 'admin'
    status: 'pending', // 'pending', 'approved', 'rejected'
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  await users.insertOne(newUser)
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

export async function verifyUser(email, password) {
  const db = await getDatabase()
  const users = db.collection('users')
  
  const user = await users.findOne({ email })
  
  if (!user) {
    return null
  }
  
  const isValid = await bcrypt.compare(password, user.password)
  
  if (!isValid) {
    return null
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function getUserById(id) {
  const db = await getDatabase()
  const users = db.collection('users')
  
  const user = await users.findOne({ id })
  
  if (!user) {
    return null
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function updateUserStatus(userId, status) {
  const db = await getDatabase()
  const users = db.collection('users')
  
  await users.updateOne(
    { id: userId },
    { 
      $set: { 
        status,
        updated_at: new Date().toISOString()
      } 
    }
  )
  
  return await getUserById(userId)
}