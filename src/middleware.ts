import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtectedRoute = path.startsWith('/dashboard') || 
                           path.startsWith('/seller') || 
                           path.startsWith('/admin');

  if (isProtectedRoute) {
    // Basic protection at middleware level. 
    // Actual server-side role checks are enforced in the protected pages using requireRole().
    const roleCookie = request.cookies.get('user_role');
    
    if (!roleCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/seller/:path*', '/admin/:path*'],
};
