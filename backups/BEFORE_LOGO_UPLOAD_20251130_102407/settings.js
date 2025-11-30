import { getDatabase } from './mongodb'

export async function getSettings() {
  const db = await getDatabase()
  const settings = db.collection('site_settings')
  
  // Get or create default settings
  let siteSettings = await settings.findOne({ type: 'general' })
  
  if (!siteSettings) {
    // Create default settings
    const defaultSettings = {
      type: 'general',
      site_name: 'Usefulio',
      site_tagline: 'Find What\'s Actually Useful',
      logo_url: '',
      contact_email: 'contact@usefulio.com',
      primary_color: '#7c3aed', // purple-600
      secondary_color: '#ec4899', // pink-600
      seo_title: 'Usefulio - Find What\'s Actually Useful',
      seo_description: 'Discover trusted, useful products and resources. Expert reviews, comparisons, and recommendations.',
      seo_keywords: 'useful products, product reviews, AI tools, tech recommendations',
      google_analytics_id: '',
      adsense_client_id: '',
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    }
    
    await settings.insertOne(defaultSettings)
    siteSettings = defaultSettings
  }
  
  return siteSettings
}

export async function updateSettings(updates) {
  const db = await getDatabase()
  const settings = db.collection('site_settings')
  
  await settings.updateOne(
    { type: 'general' },
    { 
      $set: { 
        ...updates,
        updated_at: new Date().toISOString()
      } 
    },
    { upsert: true }
  )
  
  return await getSettings()
}
