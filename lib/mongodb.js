import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URL
const dbName = process.env.DB_NAME || 'usefulio_db'
const options = {}

let clientPromise

if (!uri) {
  // Don't throw error at module load time - throw when actually trying to connect
  clientPromise = null
} else {
  let client
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

export async function getDatabase() {
  if (!clientPromise) {
    throw new Error('Please add your Mongo URL to environment variables')
  }
  const client = await clientPromise
  return client.db(dbName)
}

export default clientPromise