import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect API routes, let client-side components handle page authentication
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Allow public API routes (login, signup, logout)
  if (pathname.startsWith('/api/auth/login') || 
      pathname.startsWith('/api/auth/signup') || 
      pathname.startsWith('/api/auth/logout')) {
    return NextResponse.next()
  }

  // For protected API routes, let the individual API routes handle authentication
  // This allows them to use Node.js runtime and JWT verification
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 