import { getDatabase } from './lib/mongodb.js'
import { v4 as uuidv4 } from 'uuid'

process.env.MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'
process.env.DB_NAME = process.env.DB_NAME || 'usefulio_db'

async function addSampleTestimonials() {
  try {
    const db = await getDatabase()
    const collection = db.collection('testimonials')
    
    // Check if testimonials already exist
    const count = await collection.countDocuments()
    if (count > 0) {
      console.log(`✅ Already have ${count} testimonials in database`)
      return
    }
    
    const sampleTestimonials = [
      {
        id: uuidv4(),
        name: 'Sarah Johnson',
        role: 'Digital Marketer',
        company: 'Tech Startup Inc.',
        content: 'Usefulio has completely transformed how I discover and promote affiliate products. The platform is intuitive, and the commission rates are fantastic!',
        rating: 5,
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        status: 'approved',
        featured: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Michael Chen',
        role: 'Content Creator',
        company: 'YouTube Channel',
        content: 'I have tried many affiliate platforms, but Usefulio stands out with its extensive product catalog and reliable tracking system. Highly recommended!',
        rating: 5,
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        status: 'approved',
        featured: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Emma Williams',
        role: 'Blogger',
        company: 'Lifestyle Blog',
        content: 'The resource library and product comparisons on Usefulio make it so easy to create valuable content for my audience. My commissions have doubled since joining!',
        rating: 5,
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        status: 'approved',
        featured: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'David Martinez',
        role: 'Affiliate Marketer',
        company: 'Marketing Pro',
        content: 'Clean interface, great products, and excellent support. Usefulio makes affiliate marketing simple and profitable. Best platform I have used!',
        rating: 5,
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        status: 'approved',
        featured: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Lisa Anderson',
        role: 'Social Media Influencer',
        company: 'Instagram',
        content: 'The tracking links are reliable and the dashboard provides all the analytics I need. Usefulio has become my go-to platform for monetization.',
        rating: 5,
        avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        status: 'approved',
        featured: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'James Wilson',
        role: 'Tech Reviewer',
        company: 'TechReview.com',
        content: 'As a tech reviewer, finding quality products to promote is crucial. Usefulio offers an amazing selection with competitive commissions.',
        rating: 5,
        avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
        status: 'approved',
        featured: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]
    
    const result = await collection.insertMany(sampleTestimonials)
    console.log(`✅ Successfully added ${result.insertedCount} sample testimonials`)
    console.log('📋 Testimonials IDs:', Object.values(result.insertedIds))
    
  } catch (error) {
    console.error('❌ Error adding testimonials:', error)
    process.exit(1)
  }
  
  process.exit(0)
}

addSampleTestimonials()
