// Quick script to approve pending users
const { MongoClient } = require('mongodb')

async function approveUsers() {
  const client = new MongoClient(process.env.MONGO_URL)
  
  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db()
    const users = db.collection('users')
    
    // Show all pending users
    const pendingUsers = await users.find({ status: 'pending' }).toArray()
    
    console.log('\n📋 Pending Users:')
    console.log('================')
    
    if (pendingUsers.length === 0) {
      console.log('No pending users found.')
    } else {
      pendingUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email})`)
        console.log(`   ID: ${user.id}`)
        console.log(`   Status: ${user.status}`)
        console.log(`   Created: ${user.created_at}`)
        console.log('---')
      })
      
      // Approve all pending users
      const result = await users.updateMany(
        { status: 'pending' },
        { $set: { status: 'approved', updated_at: new Date().toISOString() } }
      )
      
      console.log(`\n✅ Approved ${result.modifiedCount} user(s)`)
    }
    
    // Show all users
    console.log('\n📊 All Users:')
    console.log('================')
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

approveUsers()
