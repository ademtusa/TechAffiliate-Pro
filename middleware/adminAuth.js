// Admin authentication middleware
// This checks if the user is authenticated and has admin privileges

export function checkAdminAuth() {
  if (typeof window === 'undefined') return false
  
  const isAdmin = sessionStorage.getItem('isAdmin')
  const adminVerified = sessionStorage.getItem('adminVerified')
  
  if (!isAdmin || !adminVerified) return false
  
  // Check if session is less than 24 hours old
  const verifiedTime = parseInt(adminVerified)
  const now = Date.now()
  const hoursDiff = (now - verifiedTime) / (1000 * 60 * 60)
  
  if (hoursDiff > 24) {
    // Session expired
    sessionStorage.removeItem('isAdmin')
    sessionStorage.removeItem('adminVerified')
    return false
  }
  
  return true
}

export function clearAdminAuth() {
  if (typeof window === 'undefined') return
  
  sessionStorage.removeItem('isAdmin')
  sessionStorage.removeItem('adminVerified')
}

// List of admin emails (in production, store this in database)
export const ADMIN_EMAILS = [
  'admin@techaffiliate.com',
  'owner@techaffiliate.com',
  // Add more admin emails here
]

export const ADMIN_CODE = 'ADMIN2025' // In production, use environment variable
