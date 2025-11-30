import { getDatabase } from './mongodb'
import { v4 as uuidv4 } from 'uuid'

export async function createTestimonial(testimonialData) {
  const db = await getDatabase()
  const testimonials = db.collection('testimonials')
  
  const newTestimonial = {
    id: uuidv4(),
    name: testimonialData.name,
    role: testimonialData.role || '',
    company: testimonialData.company || '',
    content: testimonialData.content,
    rating: testimonialData.rating || 5,
    image_url: testimonialData.image_url || '',
    status: testimonialData.status || 'pending', // pending, approved, rejected
    featured: testimonialData.featured || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  await testimonials.insertOne(newTestimonial)
  return newTestimonial
}

export async function getAllTestimonials(filters = {}) {
  const db = await getDatabase()
  const testimonials = db.collection('testimonials')
  
  let query = {}
  
  if (filters.status) {
    query.status = filters.status
  }
  
  if (filters.featured !== undefined) {
    query.featured = filters.featured
  }
  
  const allTestimonials = await testimonials
    .find(query)
    .sort({ created_at: -1 })
    .toArray()
  
  return allTestimonials
}

export async function getApprovedTestimonials() {
  return await getAllTestimonials({ status: 'approved' })
}

export async function getTestimonialById(id) {
  const db = await getDatabase()
  const testimonials = db.collection('testimonials')
  
  return await testimonials.findOne({ id })
}

export async function updateTestimonial(id, updateData) {
  const db = await getDatabase()
  const testimonials = db.collection('testimonials')
  
  const { _id, ...cleanData } = updateData
  
  await testimonials.updateOne(
    { id },
    { 
      $set: { 
        ...cleanData,
        updated_at: new Date().toISOString()
      } 
    }
  )
  
  return await getTestimonialById(id)
}

export async function deleteTestimonial(id) {
  const db = await getDatabase()
  const testimonials = db.collection('testimonials')
  
  await testimonials.deleteOne({ id })
  return { success: true }
}

export async function approveTestimonial(id) {
  return await updateTestimonial(id, { status: 'approved' })
}

export async function rejectTestimonial(id) {
  return await updateTestimonial(id, { status: 'rejected' })
}
