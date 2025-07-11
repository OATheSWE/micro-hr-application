import { db } from './index'

/**
 * Test database connection
 */
async function testConnection() {
  try {
    console.log('🔌 Testing database connection...')
    
    // Simple query to test connection
    const result = await db.execute('SELECT NOW() as current_time')
    console.log('✅ Database connection successful!')
    console.log('📅 Current database time:', result[0]?.current_time)
    
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testConnection()
    .then((success) => {
      if (success) {
        console.log('🎉 Database connection test passed!')
        process.exit(0)
      } else {
        console.log('💥 Database connection test failed!')
        process.exit(1)
      }
    })
    .catch((error) => {
      console.error('💥 Unexpected error:', error)
      process.exit(1)
    })
}

export { testConnection } 