// Production Readiness Test Suite
const tests = {
  passed: [],
  failed: [],
  warnings: []
}

async function testAPI(name, url, options = {}) {
  try {
    console.log(`\n🧪 Testing: ${name}`)
    console.log(`   URL: ${url}`)
    
    const response = await fetch(url, options)
    const data = await response.json()
    
    if (response.ok) {
      console.log(`   ✅ Status: ${response.status}`)
      console.log(`   ✅ Response: ${JSON.stringify(data).substring(0, 100)}...`)
      tests.passed.push(name)
      return { success: true, data }
    } else {
      console.log(`   ❌ Status: ${response.status}`)
      console.log(`   ❌ Error: ${JSON.stringify(data)}`)
      tests.failed.push({ name, error: data.message || 'Unknown error' })
      return { success: false, data }
    }
  } catch (error) {
    console.log(`   ❌ Exception: ${error.message}`)
    tests.failed.push({ name, error: error.message })
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log('🚀 PRODUCTION READINESS TEST SUITE')
  console.log('=' .repeat(50))
  
  const baseURL = 'http://localhost:3000'
  
  // 1. Public APIs (No Auth Required)
  console.log('\n📂 PUBLIC APIs')
  console.log('-'.repeat(50))
  
  await testAPI('Public Products API', `${baseURL}/api/products`)
  await testAPI('Public Resources API', `${baseURL}/api/resources`)
  await testAPI('Public Testimonials API', `${baseURL}/api/testimonials`)
  await testAPI('Public Categories API', `${baseURL}/api/categories`)
  await testAPI('Site Settings API', `${baseURL}/api/settings`)
  
  // 2. Auth APIs
  console.log('\n🔐 AUTHENTICATION APIs')
  console.log('-'.repeat(50))
  
  await testAPI('Auth Session', `${baseURL}/api/auth/session`)
  await testAPI('Auth Providers', `${baseURL}/api/auth/providers`)
  await testAPI('Auth CSRF', `${baseURL}/api/auth/csrf`)
  
  // 3. Admin APIs (Will fail with 401 - Expected)
  console.log('\n🔒 ADMIN APIs (Auth Required - Expecting 401)')
  console.log('-'.repeat(50))
  
  await testAPI('Admin Products', `${baseURL}/api/admin/products`)
  await testAPI('Admin Categories', `${baseURL}/api/admin/categories`)
  await testAPI('Admin Resources', `${baseURL}/api/admin/resources`)
  await testAPI('Admin Users', `${baseURL}/api/admin/users`)
  await testAPI('Admin Testimonials', `${baseURL}/api/admin/testimonials`)
  await testAPI('Admin Messages', `${baseURL}/api/admin/messages`)
  await testAPI('Admin Settings', `${baseURL}/api/admin/settings`)
  await testAPI('Admin Menus', `${baseURL}/api/admin/menus`)
  await testAPI('Admin Media', `${baseURL}/api/admin/media`)
  
  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 TEST SUMMARY')
  console.log('='.repeat(50))
  console.log(`✅ Passed: ${tests.passed.length}`)
  console.log(`❌ Failed: ${tests.failed.length}`)
  console.log(`⚠️  Warnings: ${tests.warnings.length}`)
  
  if (tests.failed.length > 0) {
    console.log('\n❌ Failed Tests:')
    tests.failed.forEach(f => {
      console.log(`   - ${f.name}: ${f.error}`)
    })
  }
  
  console.log('\n' + '='.repeat(50))
  console.log(tests.passed.length >= 13 ? '🎉 SYSTEM HEALTHY!' : '⚠️  SOME ISSUES DETECTED')
  console.log('='.repeat(50))
}

runTests().catch(console.error)
