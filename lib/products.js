import { getDatabase } from './mongodb'
import { v4 as uuidv4 } from 'uuid'

export async function createProduct(productData) {
  const db = await getDatabase()
  const products = db.collection('products')
  
  const newProduct = {
    id: uuidv4(),
    ...productData,
    view_count: 0,
    click_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  await products.insertOne(newProduct)
  return newProduct
}

export async function getAllProducts(filters = {}) {
  const db = await getDatabase()
  const products = db.collection('products')
  
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
  
  const allProducts = await products.find(query).sort({ created_at: -1 }).toArray()
  return allProducts
}

export async function getProductById(id) {
  const db = await getDatabase()
  const products = db.collection('products')
  
  const product = await products.findOne({ id })
  return product
}

export async function updateProduct(id, updateData) {
  const db = await getDatabase()
  const products = db.collection('products')
  
  await products.updateOne(
    { id },
    { 
      $set: { 
        ...updateData,
        updated_at: new Date().toISOString()
      } 
    }
  )
  
  return await getProductById(id)
}

export async function deleteProduct(id) {
  const db = await getDatabase()
  const products = db.collection('products')
  
  await products.deleteOne({ id })
  return { success: true }
}

export async function getCategories() {
  const db = await getDatabase()
  const products = db.collection('products')
  
  const categories = await products.distinct('category')
  return categories.filter(Boolean)
}