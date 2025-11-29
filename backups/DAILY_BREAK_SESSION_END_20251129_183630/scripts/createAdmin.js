const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'
const DB_NAME = process.env.DB_NAME || 'usefulio_db'

async function createAdmin() {
  const client = new MongoClient(MONGO_URL)

  try {
    await client.connect()
    console.log('✅ MongoDB bağlantısı başarılı')

    const db = client.db(DB_NAME)
    const users = db.collection('users')

    // Check if admin already exists
    const existingAdmin = await users.findOne({ email: 'admin@usefulio.com' })
    
    if (existingAdmin) {
      console.log('⚠️  Admin kullanıcısı zaten mevcut!')
      console.log('Email: admin@usefulio.com')
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

    console.log('✅ Admin kullanıcısı oluşturuldu!')
    console.log('\n===================================')
    console.log('Admin Giriş Bilgileri:')
    console.log('===================================')
    console.log('Email: admin@usefulio.com')
    console.log('Şifre: admin123')
    console.log('===================================\n')
    console.log('⚠️  GÜVENLİK İÇİN ŞİFREYİ DEĞİŞTİRİN!')

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await client.close()
  }
}

createAdmin()
