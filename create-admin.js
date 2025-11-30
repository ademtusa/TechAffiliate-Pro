// Create admin user
const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

async function createAdmin() {
  const client = new MongoClient(process.env.MONGO_URL)
  
  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db()
    const users = db.collection('users')
    
    // Check if admin exists
    const existing = await users.findOne({ email: 'admin@usefulio.com' })
    
    if (existing) {
      console.log('⚠️  Admin user already exists')
      console.log(`Email: ${existing.email}`)
      console.log(`Status: ${existing.status}`)
      return
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = {
      id: uuidv4(),
      email: 'admin@usefulio.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    await users.insertOne(adminUser)
    console.log('✅ Admin user created successfully!')
    console.log(`Email: admin@usefulio.com`)
    console.log(`Password: admin123`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

createAdmin()
