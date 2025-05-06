import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROLES } from './lib/firebase/roles';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  if (pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  // Get the session token from cookies
  const session = request.cookies.get('session')?.value;
  
  // If no session, redirect to login
  if (!session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Check role-based access
  const userRole = request.cookies.get('role')?.value;
  
  // Admin routes
  if (pathname.startsWith('/admin')) {
    if (userRole !== ROLES.ADMIN) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
  ],
}; 