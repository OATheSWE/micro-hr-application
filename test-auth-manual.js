const axios = require('axios')

const API_BASE = 'http://localhost:3000/api'

async function testAuth() {
  console.log('🧪 Testing Authentication APIs...\n')

  try {
    // Test 1: Login as Admin
    console.log('1️⃣ Testing Admin Login...')
    const adminLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@hrsystem.com',
      password: 'admin123'
    })
    console.log('✅ Admin login successful:', adminLogin.data.user.email)
    const adminToken = adminLogin.data.token

    // Test 2: Login as Employee
    console.log('\n2️⃣ Testing Employee Login...')
    const employeeLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'employee@hrsystem.com',
      password: 'employee123'
    })
    console.log('✅ Employee login successful:', employeeLogin.data.user.email)
    const employeeToken = employeeLogin.data.token

    // Test 3: Get Current User (Admin)
    console.log('\n3️⃣ Testing Get Current User (Admin)...')
    const adminMe = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
    console.log('✅ Get current user (admin) successful:', adminMe.data.user.email)

    // Test 4: Get Current User (Employee)
    console.log('\n4️⃣ Testing Get Current User (Employee)...')
    const employeeMe = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${employeeToken}` }
    })
    console.log('✅ Get current user (employee) successful:', employeeMe.data.user.email)

    // Test 5: Logout
    console.log('\n5️⃣ Testing Logout...')
    const logout = await axios.post(`${API_BASE}/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
    console.log('✅ Logout successful:', logout.data.message)

    // Test 6: Signup New User
    console.log('\n6️⃣ Testing Signup...')
    const signup = await axios.post(`${API_BASE}/auth/signup`, {
      email: 'newuser@hrsystem.com',
      password: 'newuser123',
      role: 'employee'
    })
    console.log('✅ Signup successful:', signup.data.user.email)

    console.log('\n🎉 All authentication API tests passed!')
    return true

  } catch (error) {
    console.error('\n❌ Authentication API test failed:')
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
    } else {
      console.error('Error:', error.message)
    }
    return false
  }
}

// Run the test
testAuth()
  .then((success) => {
    if (success) {
      console.log('\n✅ All tests completed successfully!')
      process.exit(0)
    } else {
      console.log('\n💥 Some tests failed!')
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error('\n💥 Test execution failed:', error)
    process.exit(1)
  }) 