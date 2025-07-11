export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth/jwt'
import { getEmployees, createEmployee, createUser, findUserByEmail } from '@/lib/db/queries'
import { hashPassword } from '@/lib/auth/jwt'

// GET /api/employees - Get all employees with pagination
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const userData = getUserFromRequest(request.headers)
    if (!userData) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (userData.role !== 'admin') {
      return NextResponse.json(
        { message: 'Access denied. Admin role required.' },
        { status: 403 }
      )
    }

    // Get pagination parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { message: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }

    // Get employees with pagination
    const result = await getEmployees(page, limit)

    return NextResponse.json({
      employees: result.employees,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    })
  } catch (error) {
    console.error('Get employees error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/employees - Create new employee
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const userData = getUserFromRequest(request.headers)
    if (!userData) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (userData.role !== 'admin') {
      return NextResponse.json(
        { message: 'Access denied. Admin role required.' },
        { status: 403 }
      )
    }

    const employeeData = await request.json()

    // Validate required fields
    const { name, email, position, department, salary } = employeeData
    if (!name || !email || !position || !department || !salary) {
      return NextResponse.json(
        { message: 'Name, email, position, department, and salary are required' },
        { status: 400 }
      )
    }

    // Validate salary
    if (typeof salary !== 'number' || salary < 0) {
      return NextResponse.json(
        { message: 'Salary must be a positive number' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Create employee
    const employee = await createEmployee({
      name,
      email,
      position,
      department,
      salary,
      image_url: employeeData.image_url || null,
    })

    // Create user account for the employee
    const defaultPassword = 'employee123' // Default password for new employees
    const hashedPassword = await hashPassword(defaultPassword)
    
    await createUser({
      email,
      password_hash: hashedPassword,
      role: 'employee',
    })

    return NextResponse.json({
      ...employee,
      message: 'Employee created successfully. Default password is: employee123'
    }, { status: 201 })
  } catch (error) {
    console.error('Create employee error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 