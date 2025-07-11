import { createUser } from './queries'
import { hashPassword } from '@/lib/auth/jwt'

/**
 * Seed the database with initial data
 */
export async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...')

    // Create admin user
    const adminPassword = await hashPassword('admin123')
    const adminUser = await createUser({
      email: 'admin@hrsystem.com',
      password_hash: adminPassword,
      role: 'admin',
    })

    console.log('✅ Admin user created:', adminUser.email)

    // Create employee user
    const employeePassword = await hashPassword('employee123')
    const employeeUser = await createUser({
      email: 'employee@hrsystem.com',
      password_hash: employeePassword,
      role: 'employee',
    })

    console.log('✅ Employee user created:', employeeUser.email)

    console.log('🎉 Database seeding completed!')
    console.log('')
    console.log('📋 Test Credentials:')
    console.log('Admin: admin@hrsystem.com / admin123')
    console.log('Employee: employee@hrsystem.com / employee123')
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    throw error
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error)
      process.exit(1)
    })
} 