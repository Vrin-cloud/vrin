import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const waitlistMode = process.env.WAITLIST_MODE === 'true'

  if (!waitlistMode) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  // Allow sign-in page, block sign-up / generic auth
  if (pathname === '/auth') {
    // /auth is the sign-in page — allow approved waitlist users to log in
    return NextResponse.next()
  }
  if (pathname.startsWith('/auth/') && pathname !== '/auth/authenticate') {
    // Block signup and other auth sub-routes, but allow /auth/authenticate (OAuth callback)
    return NextResponse.redirect(new URL('/waitlist', request.url))
  }

  // Block enterprise auth pages — redirect to enterprise contact form
  if (pathname.startsWith('/enterprise/auth')) {
    return NextResponse.redirect(new URL('/enterprise', request.url))
  }

  // Block dashboard — redirect to waitlist
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/waitlist', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/auth/:path*', '/enterprise/auth/:path*', '/dashboard/:path*'],
}
