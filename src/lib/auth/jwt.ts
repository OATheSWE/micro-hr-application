import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User } from '@/lib/db/schema'

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here'

// Token expiration time (24 hours)
const TOKEN_EXPIRY = '24h'

/**
 * Generate JWT token for user
 */
export function generateToken(user: User): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

/**
 * Verify JWT token and return payload
 */
export function verifyToken(token: string): { userId: number; email: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number
      email: string
      role: string
    }
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  return authHeader.substring(7) // Remove 'Bearer ' prefix
}

/**
 * Get user from request headers
 */
export function getUserFromRequest(headers: Headers): { userId: number; email: string; role: string } | null {
  const authHeader = headers.get('authorization')
  const token = extractTokenFromHeader(authHeader)
  
  if (!token) {
    return null
  }
  
  return verifyToken(token)
} 