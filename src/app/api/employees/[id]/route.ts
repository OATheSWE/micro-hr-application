import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth/jwt'
import { getEmployeeById, updateEmployee, deleteEmployee } from '@/lib/db/queries'

// GET /api/employees/[id] - Get employee by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const userData = getUserFromRequest(request.headers)
    if (!userData) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid employee ID' },
        { status: 400 }
      )
    }

    // Get employee
    const employee = await getEmployeeById(id)
    if (!employee) {
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      )
    }

    // Check if user is admin or the employee themselves
    if (userData.role !== 'admin' && userData.email !== employee.email) {
      return NextResponse.json(
        { message: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json(employee)
  } catch (error) {
    console.error('Get employee error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/employees/[id] - Update employee
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid employee ID' },
        { status: 400 }
      )
    }

    const updateData = await request.json()

    // Validate salary if provided
    if (updateData.salary !== undefined) {
      if (typeof updateData.salary !== 'number' || updateData.salary < 0) {
        return NextResponse.json(
          { message: 'Salary must be a positive number' },
          { status: 400 }
        )
      }
    }

    // Update employee
    const employee = await updateEmployee(id, updateData)
    if (!employee) {
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(employee)
  } catch (error) {
    console.error('Update employee error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/employees/[id] - Delete employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid employee ID' },
        { status: 400 }
      )
    }

    // Check if employee exists
    const existingEmployee = await getEmployeeById(id)
    if (!existingEmployee) {
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      )
    }

    // Delete employee
    await deleteEmployee(id)

    return NextResponse.json({
      message: 'Employee deleted successfully',
    })
  } catch (error) {
    console.error('Delete employee error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 