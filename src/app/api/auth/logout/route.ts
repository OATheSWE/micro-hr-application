export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // In a more complex system, you might want to:
    // 1. Add the token to a blacklist
    // 2. Update user's last logout time
    // 3. Log the logout event
    
    return NextResponse.json({
      message: 'Logout successful',
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 