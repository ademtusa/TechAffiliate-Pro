import { getDatabase } from './mongodb'
import { v4 as uuidv4 } from 'uuid'

export async function createCategory(categoryData) {
  const db = await getDatabase()
  const categories = db.collection('categories')
  
  // Check if category with same name exists
  const existing = await categories.findOne({ 
    name: categoryData.name,
    type: categoryData.type 
  })
  
  if (existing) {
    throw new Error('Category with this name already exists for this type')
  }
  
  const newCategory = {
    id: uuidv4(),
    name: categoryData.name,
    slug: categoryData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
    type: categoryData.type, // 'product' or 'resource'
    description: categoryData.description || '',
    icon: categoryData.icon || '',
    color: categoryData.color || '#6366F1',
    status: categoryData.status || 'active',
    order: categoryData.order || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  await categories.insertOne(newCategory)
  return newCategory
}

export async function getAllCategories(filters = {}) {
  const db = await getDatabase()
  const categories = db.collection('categories')
  
  let query = {}
  
  // Filter by type (product/resource)
  if (filters.type) {
    query.type = filters.type
  }
  
  // Filter by status
  if (filters.status) {
    query.status = filters.status
  }
  
  // Search filter
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } }
    ]
  }
  
  const allCategories = await categories.find(query).sort({ order: 1, name: 1 }).toArray()
  return allCategories
}

export async function getCategoryById(id) {
  const db = await getDatabase()
  const categories = db.collection('categories')
  
  const category = await categories.findOne({ id })
  return category
}

export async function getCategoryBySlug(slug, type) {
  const db = await getDatabase()
  const categories = db.collection('categories')
  
  const category = await categories.findOne({ slug, type })
  return category
}

export async function updateCategory(id, updateData) {
  const db = await getDatabase()
  const categories = db.collection('categories')
  
  // Remove _id if present
  const { _id, ...cleanData } = updateData
  
  // Update slug if name changed
  if (cleanData.name) {
    cleanData.slug = cleanData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  }
  
  await categories.updateOne(
    { id },
    { 
      $set: { 
        ...cleanData,
        updated_at: new Date().toISOString()
      } 
    }
  )
  
  return await getCategoryById(id)
}

export async function deleteCategory(id) {
  const db = await getDatabase()
  const categories = db.collection('categories')
  const products = db.collection('products')
  const resources = db.collection('resources')
  
  // Get category to check its type
  const category = await getCategoryById(id)
  if (!category) {
    throw new Error('Category not found')
  }
  
  // Check if category is in use
  if (category.type === 'product') {
    const productCount = await products.countDocuments({ category: category.name })
    if (productCount > 0) {
      throw new Error(`Cannot delete category. ${productCount} products are using it.`)
    }
  } else if (category.type === 'resource') {
    const resourceCount = await resources.countDocuments({ category: category.name })
    if (resourceCount > 0) {
      throw new Error(`Cannot delete category. ${resourceCount} resources are using it.`)
    }
  }
  
  await categories.deleteOne({ id })
  return { success: true }
}

export async function getCategoryStats(id) {
  const db = await getDatabase()
  const products = db.collection('products')
  const resources = db.collection('resources')
  const category = await getCategoryById(id)
  
  if (!category) {
    return null
  }
  
  let itemCount = 0
  if (category.type === 'product') {
    itemCount = await products.countDocuments({ category: category.name })
  } else if (category.type === 'resource') {
    itemCount = await resources.countDocuments({ category: category.name })
  }
  
  return {
    ...category,
    item_count: itemCount
  }
}
