import { NextRequest, NextResponse } from 'next/server'
import { findUserById } from '@/lib/db/queries'
import { getUserFromRequest } from '@/lib/auth/jwt'

export async function GET(request: NextRequest) {
  try {
    // Get user from JWT token
    const userData = getUserFromRequest(request.headers)
    
    if (!userData) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get full user data from database
    const user = await findUserById(userData.userId)
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Return user data without password
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 