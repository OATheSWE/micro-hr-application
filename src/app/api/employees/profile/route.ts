export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth/jwt'
import { findEmployeeByEmail, updateEmployee } from '@/lib/db/queries'

// GET /api/employees/profile - Get current employee's profile
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

    // Find employee by email
    const employee = await findEmployeeByEmail(userData.email)
    if (!employee) {
      return NextResponse.json(
        { message: 'Employee profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(employee)
  } catch (error) {
    console.error('Get employee profile error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/employees/profile - Update current employee's profile image
export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const userData = getUserFromRequest(request.headers)
    if (!userData) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find employee by email
    const employee = await findEmployeeByEmail(userData.email)
    if (!employee) {
      return NextResponse.json(
        { message: 'Employee profile not found' },
        { status: 404 }
      )
    }

    const { image_url } = await request.json()

    // Validate input
    if (!image_url) {
      return NextResponse.json(
        { message: 'Image URL is required' },
        { status: 400 }
      )
    }

    // Update employee's image
    const updatedEmployee = await updateEmployee(employee.id, { image_url })

    return NextResponse.json(updatedEmployee)
  } catch (error) {
    console.error('Update employee profile error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 