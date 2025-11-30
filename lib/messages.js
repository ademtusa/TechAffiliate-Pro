import { getDatabase } from './mongodb'
import { v4 as uuidv4 } from 'uuid'

export async function createMessage(messageData) {
  const db = await getDatabase()
  const messages = db.collection('messages')
  
  const newMessage = {
    id: uuidv4(),
    name: messageData.name,
    email: messageData.email,
    subject: messageData.subject || '',
    message: messageData.message,
    status: 'unread', // unread, read, archived
    created_at: new Date().toISOString()
  }
  
  await messages.insertOne(newMessage)
  return newMessage
}

export async function getAllMessages(filters = {}) {
  const db = await getDatabase()
  const messages = db.collection('messages')
  
  let query = {}
  if (filters.status) query.status = filters.status
  
  return await messages.find(query).sort({ created_at: -1 }).toArray()
}

export async function updateMessageStatus(id, status) {
  const db = await getDatabase()
  await db.collection('messages').updateOne({ id }, { $set: { status } })
  return { success: true }
}

export async function deleteMessage(id) {
  const db = await getDatabase()
  await db.collection('messages').deleteOne({ id })
  return { success: true }
}
