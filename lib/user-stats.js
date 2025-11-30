import { getDatabase } from './mongodb'

export async function getUserStats(userEmail) {
  try {
    const db = await getDatabase()
    
    // Get favorites count
    const favoritesCollection = db.collection('user_favorites')
    const favoritesCount = await favoritesCollection.countDocuments({ userEmail })
    
    // Get downloaded resources count
    const resourcesCollection = db.collection('user_resources')
    const resourcesCount = await resourcesCollection.countDocuments({ userEmail })
    
    // Get comparisons count (if implemented)
    const comparisonsCollection = db.collection('user_comparisons')
    const comparisonsCount = await comparisonsCollection.countDocuments({ userEmail })
    
    return {
      success: true,
      data: {
        favorites: favoritesCount,
        resources: resourcesCount,
        comparisons: comparisonsCount
      }
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return {
      success: false,
      error: error.message,
      data: { favorites: 0, resources: 0, comparisons: 0 }
    }
  }
}

export async function addUserFavorite(userEmail, productId) {
  try {
    const db = await getDatabase()
    const collection = db.collection('user_favorites')
    
    // Check if already exists
    const existing = await collection.findOne({ userEmail, productId })
    if (existing) {
      return { success: true, message: 'Already in favorites' }
    }
    
    await collection.insertOne({
      userEmail,
      productId,
      addedAt: new Date()
    })
    
    return { success: true, message: 'Added to favorites' }
  } catch (error) {
    console.error('Error adding favorite:', error)
    return { success: false, error: error.message }
  }
}

export async function removeUserFavorite(userEmail, productId) {
  try {
    const db = await getDatabase()
    const collection = db.collection('user_favorites')
    
    await collection.deleteOne({ userEmail, productId })
    
    return { success: true, message: 'Removed from favorites' }
  } catch (error) {
    console.error('Error removing favorite:', error)
    return { success: false, error: error.message }
  }
}

export async function getUserFavorites(userEmail) {
  try {
    const db = await getDatabase()
    const collection = db.collection('user_favorites')
    
    const favorites = await collection.find({ userEmail }).toArray()
    const productIds = favorites.map(f => f.productId)
    
    // Fetch product details
    if (productIds.length > 0) {
      const productsCollection = db.collection('products')
      const products = await productsCollection
        .find({ id: { $in: productIds }, status: 'active' })
        .toArray()
      
      return { success: true, data: products }
    }
    
    return { success: true, data: [] }
  } catch (error) {
    console.error('Error fetching user favorites:', error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function addUserResource(userEmail, resourceId) {
  try {
    const db = await getDatabase()
    const collection = db.collection('user_resources')
    
    // Check if already exists
    const existing = await collection.findOne({ userEmail, resourceId })
    if (existing) {
      return { success: true, message: 'Already downloaded' }
    }
    
    await collection.insertOne({
      userEmail,
      resourceId,
      downloadedAt: new Date()
    })
    
    return { success: true, message: 'Resource tracked' }
  } catch (error) {
    console.error('Error tracking resource:', error)
    return { success: false, error: error.message }
  }
}

export async function getUserResources(userEmail) {
  try {
    const db = await getDatabase()
    const collection = db.collection('user_resources')
    
    const userResources = await collection.find({ userEmail }).toArray()
    const resourceIds = userResources.map(r => r.resourceId)
    
    // Fetch resource details
    if (resourceIds.length > 0) {
      const resourcesCollection = db.collection('resources')
      const resources = await resourcesCollection
        .find({ id: { $in: resourceIds }, status: 'active' })
        .toArray()
      
      // Add downloadedAt to each resource
      const enrichedResources = resources.map(resource => {
        const userResource = userResources.find(ur => ur.resourceId === resource.id)
        return {
          ...resource,
          downloadedAt: userResource.downloadedAt
        }
      })
      
      return { success: true, data: enrichedResources }
    }
    
    return { success: true, data: [] }
  } catch (error) {
    console.error('Error fetching user resources:', error)
    return { success: false, error: error.message, data: [] }
  }
}
