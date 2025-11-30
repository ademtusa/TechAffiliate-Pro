import { getDatabase } from './mongodb'
import { v4 as uuidv4 } from 'uuid'

export async function getMenus() {
  try {
    const db = await getDatabase()
    const menus = await db.collection('menus').find({}).sort({ order: 1 }).toArray()
    return menus
  } catch (error) {
    console.error('Error fetching menus:', error)
    throw error
  }
}

export async function getMenuById(id) {
  try {
    const db = await getDb()
    const menu = await db.collection('menus').findOne({ id })
    return menu
  } catch (error) {
    console.error('Error fetching menu:', error)
    throw error
  }
}

export async function createMenu(menuData) {
  try {
    const db = await getDb()
    
    const newMenu = {
      id: uuidv4(),
      ...menuData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    await db.collection('menus').insertOne(newMenu)
    return newMenu
  } catch (error) {
    console.error('Error creating menu:', error)
    throw error
  }
}

export async function updateMenu(id, menuData) {
  try {
    const db = await getDb()
    
    const updateData = {
      ...menuData,
      updated_at: new Date().toISOString()
    }
    
    delete updateData.id
    delete updateData._id
    delete updateData.created_at
    
    const result = await db.collection('menus').updateOne(
      { id },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      throw new Error('Menu not found')
    }
    
    return await getMenuById(id)
  } catch (error) {
    console.error('Error updating menu:', error)
    throw error
  }
}

export async function deleteMenu(id) {
  try {
    const db = await getDb()
    const result = await db.collection('menus').deleteOne({ id })
    
    if (result.deletedCount === 0) {
      throw new Error('Menu not found')
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting menu:', error)
    throw error
  }
}
