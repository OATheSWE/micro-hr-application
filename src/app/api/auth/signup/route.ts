export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail } from '@/lib/db/queries'
import { hashPassword, generateToken } from '@/lib/auth/jwt'

export async function POST(request: NextRequest) {
  try {
    const { email, password, role = 'employee' } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate role
    if (role !== 'admin' && role !== 'employee') {
      return NextResponse.json(
        { message: 'Role must be either admin or employee' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await createUser({
      email,
      password_hash: passwordHash,
      role,
    })

    // Generate JWT token
    const token = generateToken(user)

    // Return user data (without password) and token
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'User created successfully',
      user: userWithoutPassword,
      token,
    }, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 