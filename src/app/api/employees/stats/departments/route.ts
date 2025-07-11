import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth/jwt'
import { getDepartmentStats } from '@/lib/db/queries'

// GET /api/employees/stats/departments - Get department statistics
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

    // Get department statistics
    const stats = await getDepartmentStats()

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Get department stats error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 