import { eq, desc, asc, count } from 'drizzle-orm'
import { db } from './index'
import { users, employees, type User, type NewUser, type Employee, type NewEmployee } from './schema'

// ===== USER QUERIES =====

/**
 * Create a new user with hashed password
 */
export async function createUser(userData: Omit<NewUser, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
  try {
    const [user] = await db.insert(users).values(userData).returning()
    return user
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('Failed to create user')
  }
}

/**
 * Find user by email for authentication
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email))
    return user || null
  } catch (error) {
    console.error('Error finding user by email:', error)
    throw new Error('Failed to find user')
  }
}

/**
 * Find user by ID
 */
export async function findUserById(id: number): Promise<User | null> {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id))
    return user || null
  } catch (error) {
    console.error('Error finding user by ID:', error)
    throw new Error('Failed to find user')
  }
}

// ===== EMPLOYEE QUERIES =====

/**
 * Create a new employee
 */
export async function createEmployee(employeeData: Omit<NewEmployee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
  try {
    const [employee] = await db.insert(employees).values(employeeData).returning()
    return employee
  } catch (error) {
    console.error('Error creating employee:', error)
    throw new Error('Failed to create employee')
  }
}

/**
 * Get all employees with pagination
 */
export async function getEmployees(page: number = 1, limit: number = 10): Promise<{ employees: Employee[], total: number }> {
  try {
    const offset = (page - 1) * limit
    
    // Get total count
    const countResult = await db.select({ count: count() }).from(employees)
    const total = Number(countResult[0]?.count || 0)
    
    // Get paginated employees
    const employeeList = await db
      .select()
      .from(employees)
      .orderBy(desc(employees.created_at))
      .limit(limit)
      .offset(offset)
    
    return { employees: employeeList, total }
  } catch (error) {
    console.error('Error getting employees:', error)
    throw new Error('Failed to get employees')
  }
}

/**
 * Get employee by ID
 */
export async function getEmployeeById(id: number): Promise<Employee | null> {
  try {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id))
    return employee || null
  } catch (error) {
    console.error('Error getting employee by ID:', error)
    throw new Error('Failed to get employee')
  }
}

/**
 * Find employee by email
 */
export async function findEmployeeByEmail(email: string): Promise<Employee | null> {
  try {
    const [employee] = await db.select().from(employees).where(eq(employees.email, email))
    return employee || null
  } catch (error) {
    console.error('Error finding employee by email:', error)
    throw new Error('Failed to find employee')
  }
}

/**
 * Update employee by ID
 */
export async function updateEmployee(id: number, employeeData: Partial<Omit<NewEmployee, 'id' | 'created_at' | 'updated_at'>>): Promise<Employee> {
  try {
    const [employee] = await db
      .update(employees)
      .set({ ...employeeData, updated_at: new Date() })
      .where(eq(employees.id, id))
      .returning()
    
    if (!employee) {
      throw new Error('Employee not found')
    }
    
    return employee
  } catch (error) {
    console.error('Error updating employee:', error)
    throw new Error('Failed to update employee')
  }
}

/**
 * Delete employee by ID
 */
export async function deleteEmployee(id: number): Promise<void> {
  try {
    await db.delete(employees).where(eq(employees.id, id))
  } catch (error) {
    console.error('Error deleting employee:', error)
    throw new Error('Failed to delete employee')
  }
}

/**
 * Get employees by department
 */
export async function getEmployeesByDepartment(department: string): Promise<Employee[]> {
  try {
    return await db
      .select()
      .from(employees)
      .where(eq(employees.department, department))
      .orderBy(asc(employees.name))
  } catch (error) {
    console.error('Error getting employees by department:', error)
    throw new Error('Failed to get employees by department')
  }
}

/**
 * Get department statistics
 */
export async function getDepartmentStats(): Promise<{ department: string, count: number }[]> {
  try {
    const stats = await db
      .select({
        department: employees.department,
        count: count(),
      })
      .from(employees)
      .groupBy(employees.department)
      .orderBy(asc(employees.department))
    
    return stats.map(stat => ({
      department: stat.department,
      count: Number(stat.count),
    }))
  } catch (error) {
    console.error('Error getting department stats:', error)
    throw new Error('Failed to get department statistics')
  }
} 