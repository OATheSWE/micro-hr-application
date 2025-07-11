const axios = require('axios')

const API_BASE = 'http://localhost:3000/api'

async function testEmployeeApis() {
  console.log('🧪 Testing Employee APIs...\n')

  try {
    // First, login as admin to get token
    console.log('1️⃣ Logging in as admin...')
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@hrsystem.com',
      password: 'admin123'
    })
    const token = loginResponse.data.token
    console.log('✅ Admin login successful')

    const headers = { Authorization: `Bearer ${token}` }

    // Test 2: Create Employee
    console.log('\n2️⃣ Testing Create Employee...')
    const newEmployee = {
      name: 'John Doe',
      email: `john.doe.${Date.now()}@company.com`,
      position: 'Software Engineer',
      department: 'Engineering',
      salary: 75000
    }
    const createResponse = await axios.post(`${API_BASE}/employees`, newEmployee, { headers })
    console.log('✅ Employee created:', createResponse.data.name)
    const employeeId = createResponse.data.id

    // Test 3: Get All Employees
    console.log('\n3️⃣ Testing Get All Employees...')
    const listResponse = await axios.get(`${API_BASE}/employees?page=1&limit=10`, { headers })
    console.log('✅ Employees retrieved:', listResponse.data.employees.length, 'employees')
    console.log('   Total:', listResponse.data.total, 'Page:', listResponse.data.page)

    // Test 4: Get Employee by ID
    console.log('\n4️⃣ Testing Get Employee by ID...')
    const getResponse = await axios.get(`${API_BASE}/employees/${employeeId}`, { headers })
    console.log('✅ Employee retrieved:', getResponse.data.name)

    // Test 5: Update Employee
    console.log('\n5️⃣ Testing Update Employee...')
    const updateData = {
      salary: 80000,
      position: 'Senior Software Engineer'
    }
    const updateResponse = await axios.put(`${API_BASE}/employees/${employeeId}`, updateData, { headers })
    console.log('✅ Employee updated:', updateResponse.data.name, 'Salary:', updateResponse.data.salary)

    // Test 6: Get Department Stats
    console.log('\n6️⃣ Testing Get Department Stats...')
    const statsResponse = await axios.get(`${API_BASE}/employees/stats/departments`, { headers })
    console.log('✅ Department stats retrieved:', statsResponse.data.length, 'departments')

    // Test 7: Delete Employee
    console.log('\n7️⃣ Testing Delete Employee...')
    const deleteResponse = await axios.delete(`${API_BASE}/employees/${employeeId}`, { headers })
    console.log('✅ Employee deleted:', deleteResponse.data.message)

    // Test 8: Verify Employee Deleted
    console.log('\n8️⃣ Testing Employee Deletion Verification...')
    try {
      await axios.get(`${API_BASE}/employees/${employeeId}`, { headers })
      console.log('❌ Employee still exists (should be deleted)')
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Employee successfully deleted (404 as expected)')
      } else {
        console.log('❌ Unexpected error:', error.response?.data)
      }
    }

    console.log('\n🎉 All employee API tests passed!')
    return true

  } catch (error) {
    console.error('\n❌ Employee API test failed:')
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
testEmployeeApis()
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