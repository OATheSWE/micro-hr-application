import { authApi } from './auth'

/**
 * Test all authentication APIs
 */
async function testAuthApis() {
  console.log('🧪 Testing Authentication APIs...\n')

  try {
    // Test 1: Signup as Admin
    console.log('1️⃣ Testing Admin Signup...')
    const adminSignup = await authApi.signup({
      email: 'testadmin@hrsystem.com',
      password: 'testadmin123',
      role: 'admin'
    })
    console.log('✅ Admin signup successful:', adminSignup.user.email)
    const adminToken = adminSignup.token

    // Test 2: Signup as Employee
    console.log('\n2️⃣ Testing Employee Signup...')
    const employeeSignup = await authApi.signup({
      email: 'testemployee@hrsystem.com',
      password: 'testemployee123',
      role: 'employee'
    })
    console.log('✅ Employee signup successful:', employeeSignup.user.email)
    const employeeToken = employeeSignup.token

    // Test 3: Login as Admin
    console.log('\n3️⃣ Testing Admin Login...')
    const adminLogin = await authApi.login({
      email: 'admin@hrsystem.com',
      password: 'admin123'
    })
    console.log('✅ Admin login successful:', adminLogin.user.email)

    // Test 4: Login as Employee
    console.log('\n4️⃣ Testing Employee Login...')
    const employeeLogin = await authApi.login({
      email: 'employee@hrsystem.com',
      password: 'employee123'
    })
    console.log('✅ Employee login successful:', employeeLogin.user.email)

    // Test 5: Get Current User (Admin)
    console.log('\n5️⃣ Testing Get Current User (Admin)...')
    // We need to manually set the token for this test
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', adminToken)
    }
    const adminMe = await authApi.me()
    console.log('✅ Get current user (admin) successful:', adminMe.user.email)

    // Test 6: Get Current User (Employee)
    console.log('\n6️⃣ Testing Get Current User (Employee)...')
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', employeeToken)
    }
    const employeeMe = await authApi.me()
    console.log('✅ Get current user (employee) successful:', employeeMe.user.email)

    // Test 7: Logout
    console.log('\n7️⃣ Testing Logout...')
    const logout = await authApi.logout()
    console.log('✅ Logout successful:', logout.message)

    console.log('\n🎉 All authentication API tests passed!')
    return true

  } catch (error: any) {
    console.error('\n❌ Authentication API test failed:', error.response?.data || error.message)
    return false
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testAuthApis()
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
}

export { testAuthApis } 