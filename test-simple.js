const axios = require('axios')

const API_BASE = 'http://localhost:3000/api'

async function testSimple() {
  console.log('🧪 Simple Employee API Test...\n')

  try {
    // Login as admin
    console.log('1️⃣ Logging in as admin...')
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@hrsystem.com',
      password: 'admin123'
    })
    const token = loginResponse.data.token
    console.log('✅ Admin login successful')

    const headers = { Authorization: `Bearer ${token}` }

    // Test: Create Employee
    console.log('\n2️⃣ Testing Create Employee...')
    const newEmployee = {
      name: 'Test User',
      email: 'test@company.com',
      position: 'Developer',
      department: 'IT',
      salary: 50000
    }
    
    console.log('Sending request with data:', newEmployee)
    const createResponse = await axios.post(`${API_BASE}/employees`, newEmployee, { headers })
    console.log('✅ Employee created:', createResponse.data.name)

    return true

  } catch (error) {
    console.error('\n❌ Test failed:')
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
      console.error('Headers:', error.response.headers)
    } else {
      console.error('Error:', error.message)
    }
    return false
  }
}

// Run the test
testSimple()
  .then((success) => {
    if (success) {
      console.log('\n✅ Test completed successfully!')
      process.exit(0)
    } else {
      console.log('\n💥 Test failed!')
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error('\n💥 Test execution failed:', error)
    process.exit(1)
  }) 