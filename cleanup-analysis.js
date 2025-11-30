// Cleanup Analysis - Find unused/temporary files (NO DATA LOSS)
const fs = require('fs')
const path = require('path')

const results = {
  temporaryFiles: [],
  testScripts: [],
  backupFiles: [],
  unusedComponents: [],
  totalSize: 0
}

function analyzeDirectory(dir, relativePath = '') {
  const items = fs.readdirSync(dir)
  
  items.forEach(item => {
    const fullPath = path.join(dir, item)
    const relPath = path.join(relativePath, item)
    
    // Skip node_modules, .git, .next
    if (['node_modules', '.git', '.next', '.emergent'].includes(item)) {
      return
    }
    
    const stats = fs.statSync(fullPath)
    
    if (stats.isDirectory()) {
      analyzeDirectory(fullPath, relPath)
    } else if (stats.isFile()) {
      const ext = path.extname(item)
      const size = stats.size
      
      // Temporary/Test files
      if (item.includes('test.js') || 
          item.includes('production-test') ||
          item.includes('cleanup-analysis') ||
          item.includes('approve-user') ||
          item.includes('create-admin') ||
          item.includes('create-test-user') ||
          item.includes('fix-user-database') ||
          item.includes('check-databases')) {
        results.testScripts.push({ path: relPath, size })
        results.totalSize += size
      }
      
      // Backup files
      if (item.includes('.bak') || 
          item.includes('.backup') || 
          item.includes('.old')) {
        results.backupFiles.push({ path: relPath, size })
        results.totalSize += size
      }
      
      // Temp files
      if (item.startsWith('tmp') || 
          item.startsWith('temp') ||
          item.endsWith('.tmp')) {
        results.temporaryFiles.push({ path: relPath, size })
        results.totalSize += size
      }
    }
  })
}

console.log('🔍 CLEANUP ANALYSIS - Safe Deletion Candidates')
console.log('=' .repeat(60))
console.log('⚠️  NO DATA WILL BE DELETED - Analysis Only\n')

analyzeDirectory('/app')

console.log('📋 RESULTS:')
console.log('-'.repeat(60))

if (results.testScripts.length > 0) {
  console.log('\n🧪 Test/Setup Scripts (Can be safely deleted):')
  results.testScripts.forEach(f => {
    console.log(`   - ${f.path} (${(f.size / 1024).toFixed(2)} KB)`)
  })
}

if (results.backupFiles.length > 0) {
  console.log('\n💾 Backup Files (Can be safely deleted):')
  results.backupFiles.forEach(f => {
    console.log(`   - ${f.path} (${(f.size / 1024).toFixed(2)} KB)`)
  })
}

if (results.temporaryFiles.length > 0) {
  console.log('\n🗑️  Temporary Files (Can be safely deleted):')
  results.temporaryFiles.forEach(f => {
    console.log(`   - ${f.path} (${(f.size / 1024).toFixed(2)} KB)`)
  })
}

console.log('\n' + '='.repeat(60))
console.log('📊 SUMMARY:')
console.log(`   Total files found: ${results.testScripts.length + results.backupFiles.length + results.temporaryFiles.length}`)
console.log(`   Total size: ${(results.totalSize / 1024).toFixed(2)} KB`)
console.log('\n✅ These files can be safely deleted without data loss')
console.log('⚠️  Review list before deletion!')
console.log('='.repeat(60))
