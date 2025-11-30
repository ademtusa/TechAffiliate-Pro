// Move users to correct database
const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

async function fixUserDatabase() {
  const client = new MongoClient(process.env.MONGO_URL)
  
  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const correctDb = client.db('usefulio_db')
    const users = correctDb.collection('users')
    
    // Check if test user exists in correct DB
    const existing = await users.findOne({ email: 'test@user.com' })
    
    if (existing) {
      console.log('✅ Test user already exists in usefulio_db')
      console.log(`   Status: ${existing.status}`)
      return
    }
    
    // Create test user in correct database
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
    console.log('✅ Test user created in usefulio_db!')
    console.log(`   Email: test@user.com`)
    console.log(`   Password: test123`)
    console.log(`   Status: pending`)
    
    // Create another approved user for testing
    const hashedPassword2 = await bcrypt.hash('user123', 12)
    
    const user2 = {
      id: uuidv4(),
      email: 'user@example.com',
      password: hashedPassword2,
      name: 'Regular User',
      role: 'user',
      status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    await users.insertOne(user2)
    console.log('✅ Regular user created in usefulio_db!')
    console.log(`   Email: user@example.com`)
    console.log(`   Password: user123`)
    console.log(`   Status: approved`)
    
    // Show all users
    console.log('\n👥 All users in usefulio_db:')
    console.log('============================')
    const allUsers = await users.find({}).toArray()
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role} - ${user.status}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

fixUserDatabase()
