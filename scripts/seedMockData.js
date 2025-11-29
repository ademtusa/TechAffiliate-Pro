const { MongoClient } = require('mongodb')
const { v4: uuidv4 } = require('uuid')

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'
const DB_NAME = process.env.DB_NAME || 'usefulio_db'

const mockProducts = [
  {
    id: uuidv4(),
    title: 'ChatGPT Plus',
    description: 'Advanced AI assistant with GPT-4 access, faster response times, and priority access to new features.',
    category: 'AI Tools',
    price: '$20/month',
    affiliate_link: 'https://openai.com/chatgpt',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    features: 'GPT-4 access\nFaster responses\nPriority support\nEarly feature access',
    pros: 'Most advanced AI model\nHighly accurate responses\nGreat for coding',
    cons: 'Monthly subscription required\nCan be slow during peak times',
    rating: '4.8',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Midjourney',
    description: 'AI-powered image generation tool that creates stunning artwork from text descriptions.',
    category: 'AI Tools',
    price: '$10/month',
    affiliate_link: 'https://midjourney.com',
    image_url: 'https://images.unsplash.com/photo-1686191128892-c15d4d23e0c7?w=400',
    features: 'Text-to-image generation\nHigh-quality outputs\nMultiple style options\nCommercial use allowed',
    pros: 'Exceptional image quality\nEasy to use\nActive community',
    cons: 'Discord-based interface\nLimited free tier',
    rating: '4.7',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Grammarly Premium',
    description: 'AI-powered writing assistant that helps you write clear, mistake-free content.',
    category: 'Productivity',
    price: '$12/month',
    affiliate_link: 'https://grammarly.com',
    image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400',
    features: 'Grammar checking\nStyle suggestions\nPlagiarism detection\nTone adjustment',
    pros: 'Works everywhere\nComprehensive feedback\nImproves writing skills',
    cons: 'Can be expensive\nSome suggestions are too aggressive',
    rating: '4.6',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'NordVPN',
    description: 'Fast, secure VPN service with servers in 60+ countries. Protect your privacy online.',
    category: 'VPN',
    price: '$3.99/month',
    affiliate_link: 'https://nordvpn.com',
    image_url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400',
    features: '5500+ servers worldwide\nNo-logs policy\n6 simultaneous connections\n24/7 support',
    pros: 'Fast speeds\nStrong encryption\nGreat for streaming',
    cons: 'Desktop app can be slow\nPricier than some competitors',
    rating: '4.5',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Notion',
    description: 'All-in-one workspace for notes, tasks, wikis, and databases.',
    category: 'Productivity',
    price: 'Free / $8/month',
    affiliate_link: 'https://notion.so',
    image_url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400',
    features: 'Notes and docs\nDatabases\nKanban boards\nTeam collaboration',
    pros: 'Highly customizable\nGreat templates\nGenerous free tier',
    cons: 'Steep learning curve\nCan be slow with large databases',
    rating: '4.7',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

async function seedData() {
  const client = new MongoClient(MONGO_URL)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db(DB_NAME)
    const products = db.collection('products')

    // Check if products exist
    const existingProducts = await products.countDocuments()
    
    if (existingProducts > 0) {
      console.log(`⚠️  ${existingProducts} products already exist. Skipping...`)
    } else {
      await products.insertMany(mockProducts)
      console.log(`✅ Added ${mockProducts.length} demo products`)
    }

    console.log('\n===================================')
    console.log('Mock Data Seeding Complete!')
    console.log('===================================')
    console.log(`Products in DB: ${await products.countDocuments()}`)
    console.log('===================================\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

seedData()
