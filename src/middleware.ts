import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getUserFromRequest } from '@/lib/auth/jwt'

// Define protected routes and their required roles
const protectedRoutes = {
  '/admin': ['admin'],
  '/dashboard': ['admin'],
  '/employees': ['admin'],
  '/profile': ['admin', 'employee'],
}

// Define public routes that don't need authentication
const publicRoutes = ['/login', '/', '/api/auth/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if route is protected
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
    pathname.startsWith(route)
  )

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Get user from JWT token
  const userData = getUserFromRequest(request.headers)

  if (!userData) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access
  const requiredRoles = protectedRoutes[pathname as keyof typeof protectedRoutes] || []
  
  if (requiredRoles.length > 0 && !requiredRoles.includes(userData.role)) {
    // Redirect to unauthorized page or return 403
    const unauthorizedUrl = new URL('/unauthorized', request.url)
    return NextResponse.redirect(unauthorizedUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 