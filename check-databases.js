// Check all databases and collections
const { MongoClient } = require('mongodb')

async function checkDatabases() {
  const client = new MongoClient(process.env.MONGO_URL)
  
  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    // List all databases
    const adminDb = client.db().admin()
    const { databases } = await adminDb.listDatabases()
    
    console.log('\n📊 Available Databases:')
    console.log('=======================')
    databases.forEach(db => {
      console.log(`- ${db.name} (${(db.sizeOnDisk / 1024).toFixed(2)} KB)`)
    })
    
    // Check usefulio_db
    console.log('\n🔍 Checking usefulio_db database:')
    console.log('==================================')
    const db = client.db('usefulio_db')
    const collections = await db.listCollections().toArray()
    
    if (collections.length === 0) {
      console.log('⚠️  No collections found in usefulio_db')
    } else {
      console.log('Collections:')
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments()
        console.log(`  - ${col.name}: ${count} documents`)
      }
    }
    
    // Check users collection specifically
    console.log('\n👥 Users in usefulio_db:')
    console.log('========================')
    const users = await db.collection('users').find({}).toArray()
    if (users.length === 0) {
      console.log('No users found!')
    } else {
      users.forEach(user => {
        console.log(`  - ${user.name} (${user.email}) - ${user.role} - ${user.status}`)
      })
    }
    
    // Check default database (test)
    console.log('\n🔍 Checking default (test) database:')
    console.log('=====================================')
    const defaultDb = client.db()
    const defaultCollections = await defaultDb.listCollections().toArray()
    
    if (defaultCollections.length === 0) {
      console.log('⚠️  No collections found in default database')
    } else {
      console.log('Collections:')
      for (const col of defaultCollections) {
        const count = await defaultDb.collection(col.name).countDocuments()
        console.log(`  - ${col.name}: ${count} documents`)
        
        if (col.name === 'users') {
          console.log('\n👥 Users in default database:')
          const defaultUsers = await defaultDb.collection('users').find({}).toArray()
          defaultUsers.forEach(user => {
            console.log(`  - ${user.name} (${user.email}) - ${user.role} - ${user.status}`)
          })
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

checkDatabases()
