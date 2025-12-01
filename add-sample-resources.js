const { MongoClient } = require('mongodb')
const { v4: uuidv4 } = require('uuid')

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/usefulio'

const sampleResources = [
  {
    id: uuidv4(),
    title: 'Ultimate AI Prompt Guide (PDF)',
    description: '100+ proven prompts for ChatGPT and AI tools to boost your productivity',
    category: 'AI Tools',
    type: 'pdf',
    file_url: 'https://example.com/ai-prompts.pdf',
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500',
    file_size: '2.5 MB',
    downloads: 0,
    status: 'active',
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: 'Web Hosting Checklist',
    description: 'Complete checklist for choosing the right hosting provider for your business',
    category: 'Web Development',
    type: 'pdf',
    file_url: 'https://example.com/hosting-checklist.pdf',
    thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500',
    file_size: '1.2 MB',
    downloads: 0,
    status: 'active',
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: 'VPN Setup Video Tutorial',
    description: 'Step-by-step guide to securing your internet connection with a VPN',
    category: 'Security',
    type: 'video',
    file_url: 'https://example.com/vpn-tutorial.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500',
    file_size: '125 MB',
    downloads: 0,
    status: 'active',
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: 'Automation Workflow Templates',
    description: '20 ready-to-use automation templates for common business tasks',
    category: 'Productivity',
    type: 'pdf',
    file_url: 'https://example.com/automation-templates.pdf',
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
    file_size: '3.8 MB',
    downloads: 0,
    status: 'active',
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: 'AI Tools Comparison Sheet',
    description: 'Side-by-side comparison of top AI tools with pricing and features',
    category: 'AI Tools',
    type: 'pdf',
    file_url: 'https://example.com/ai-comparison.pdf',
    thumbnail_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500',
    file_size: '1.8 MB',
    downloads: 0,
    status: 'active',
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function addSampleResources() {
  const client = new MongoClient(MONGO_URL)
  
  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db()
    const collection = db.collection('resources')
    
    // Check if resources already exist
    const count = await collection.countDocuments()
    if (count > 0) {
      console.log(`ℹ️  ${count} resources already exist. Skipping...`)
      return
    }
    
    // Insert sample resources
    const result = await collection.insertMany(sampleResources)
    console.log(`✅ Added ${result.insertedCount} sample resources`)
    
    // Display added resources
    sampleResources.forEach((resource, index) => {
      console.log(`   ${index + 1}. ${resource.title} (${resource.type})`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
    console.log('\n✅ Done!')
  }
}

addSampleResources()
