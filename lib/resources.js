import { getDatabase } from './mongodb'
import { v4 as uuidv4 } from 'uuid'

export async function createResource(resourceData) {
  const db = await getDatabase()
  const resources = db.collection('resources')
  
  const newResource = {
    id: uuidv4(),
    ...resourceData,
    download_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  await resources.insertOne(newResource)
  return newResource
}

export async function getAllResources(filters = {}) {
  const db = await getDatabase()
  const resources = db.collection('resources')
  
  let query = {}
  
  // Search filter
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } }
    ]
  }
  
  // Category filter
  if (filters.category) {
    query.category = filters.category
  }
  
  // Status filter
  if (filters.status) {
    query.status = filters.status
  }
  
  // Type filter (pdf, video, image, etc)
  if (filters.type) {
    query.type = filters.type
  }
  
  const allResources = await resources.find(query).sort({ created_at: -1 }).toArray()
  return allResources
}

export async function getPublishedResources(filters = {}) {
  const db = await getDatabase()
  const resources = db.collection('resources')
  
  let query = { status: 'published' }
  
  if (filters.category) {
    query.category = filters.category
  }
  
  if (filters.type) {
    query.type = filters.type
  }
  
  // Use createdAt (without underscore) for sorting
  const publishedResources = await resources.find(query).sort({ createdAt: -1 }).toArray()
  return publishedResources
}

export async function getResourceById(id) {
  const db = await getDatabase()
  const resources = db.collection('resources')
  
  const resource = await resources.findOne({ id })
  return resource
}

export async function updateResource(id, updateData) {
  const db = await getDatabase()
  const resources = db.collection('resources')
  
  await resources.updateOne(
    { id },
    { 
      $set: { 
        ...updateData,
        updated_at: new Date().toISOString()
      } 
    }
  )
  
  return await getResourceById(id)
}

export async function deleteResource(id) {
  const db = await getDatabase()
  const resources = db.collection('resources')
  
  await resources.deleteOne({ id })
  return { success: true }
}

export async function trackDownload(resourceId, userId) {
  const db = await getDatabase()
  const resources = db.collection('resources')
  const downloads = db.collection('resource_downloads')
  
  // Get resource to check category
  const resource = await resources.findOne({ id: resourceId })
  if (!resource) {
    return { success: false, message: 'Resource not found' }
  }
  
  // RULE: User can download only ONE resource per category
  // Check if user already downloaded ANY resource from this category
  const existingCategoryDownload = await downloads.findOne({
    user_id: userId,
    category: resource.category
  })
  
  if (existingCategoryDownload) {
    return { 
      success: false, 
      message: `You have already downloaded a resource from the "${resource.category}" category. Only one download per category is allowed.`,
      already_downloaded: true,
      category: resource.category
    }
  }
  
  // Record download with category info
  await downloads.insertOne({
    id: uuidv4(),
    resource_id: resourceId,
    user_id: userId,
    category: resource.category,
    downloaded_at: new Date().toISOString()
  })
  
  // Increment download count
  await resources.updateOne(
    { id: resourceId },
    { $inc: { download_count: 1 } }
  )
  
  return { success: true, message: 'Download tracked successfully' }
}

export async function hasUserDownloaded(resourceId, userId) {
  const db = await getDatabase()
  const downloads = db.collection('resource_downloads')
  
  const download = await downloads.findOne({
    resource_id: resourceId,
    user_id: userId
  })
  
  return !!download
}

export async function getResourceCategories() {
  const db = await getDatabase()
  const resources = db.collection('resources')
  
  const categories = await resources.distinct('category')
  return categories.filter(Boolean)
}

export async function getDownloadStats(resourceId) {
  const db = await getDatabase()
  const downloads = db.collection('resource_downloads')
  
  const stats = {
    total_downloads: await downloads.countDocuments({ resource_id: resourceId }),
    unique_users: (await downloads.distinct('user_id', { resource_id: resourceId })).length
  }
  
  return stats
}
