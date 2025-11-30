// Create test user
const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

async function createTestUser() {
  const client = new MongoClient(process.env.MONGO_URL)
  
  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db()
    const users = db.collection('users')
    
    // Create test user (pending approval)
    const hashedPassword = await bcrypt.hash('test123', 12)
    
    const testUser = {
      id: uuidv4(),
      email: 'test@user.com',
      password: hashedPassword,
      name: 'Test User',
      role: 'user',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    await users.insertOne(testUser)
    console.log('✅ Test user created successfully!')
    console.log(`Email: test@user.com`)
    console.log(`Password: test123`)
    console.log(`Status: pending (needs admin approval)`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

createTestUser()
