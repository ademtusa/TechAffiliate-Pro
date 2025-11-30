import { getDb } from './mongodb'
import { v4 as uuidv4 } from 'uuid'

export async function getMediaFiles() {
  try {
    const db = await getDb()
    const media = await db.collection('media').find({}).sort({ created_at: -1 }).toArray()
    return media
  } catch (error) {
    console.error('Error fetching media:', error)
    throw error
  }
}

export async function getMediaById(id) {
  try {
    const db = await getDb()
    const media = await db.collection('media').findOne({ id })
    return media
  } catch (error) {
    console.error('Error fetching media:', error)
    throw error
  }
}

export async function createMedia(mediaData) {
  try {
    const db = await getDb()
    
    const newMedia = {
      id: uuidv4(),
      ...mediaData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    await db.collection('media').insertOne(newMedia)
    return newMedia
  } catch (error) {
    console.error('Error creating media:', error)
    throw error
  }
}

export async function updateMedia(id, mediaData) {
  try {
    const db = await getDb()
    
    const updateData = {
      ...mediaData,
      updated_at: new Date().toISOString()
    }
    
    delete updateData.id
    delete updateData._id
    delete updateData.created_at
    
    const result = await db.collection('media').updateOne(
      { id },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      throw new Error('Media not found')
    }
    
    return await getMediaById(id)
  } catch (error) {
    console.error('Error updating media:', error)
    throw error
  }
}

export async function deleteMedia(id) {
  try {
    const db = await getDb()
    const result = await db.collection('media').deleteOne({ id })
    
    if (result.deletedCount === 0) {
      throw new Error('Media not found')
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting media:', error)
    throw error
  }
}
