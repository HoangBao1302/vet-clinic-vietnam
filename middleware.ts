import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/downloads',
  '/profile',
  '/affiliate/apply',
  '/affiliate/dashboard',
  '/dashboard',
];

// Routes that require paid membership
const paidOnlyRoutes = [
  '/members/signals',
  '/members/webinars',
  '/members/community',
];

// Admin only routes
const adminOnlyRoutes = [
  '/admin',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPaidOnlyRoute = paidOnlyRoutes.some(route => pathname.startsWith(route));
  const isAdminOnlyRoute = adminOnlyRoutes.some(route => pathname.startsWith(route));

  // Debug logging for downloads route
  if (pathname === '/downloads') {
    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    console.log('Downloads middleware check:', {
      pathname,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      cookies: request.cookies.getAll().map(c => c.name),
      isMobile,
      userAgent: userAgent.substring(0, 50)
    });
    
    // For downloads route, be more lenient - let the client-side handle auth
    // Only redirect if absolutely no token exists and it's not a retry
    const isRetry = request.nextUrl.searchParams.get('retry') === 'true';
    if (!token && !isRetry) {
      console.log('Downloads: No token found, redirecting to login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', '/downloads');
      return NextResponse.redirect(loginUrl);
    }
    
    // If we have a token or it's a retry, let it through
    return NextResponse.next();
  }

  // Redirect to login if accessing protected route without token
  if ((isProtectedRoute || isPaidOnlyRoute || isAdminOnlyRoute) && !token) {
    console.log('Redirecting to login:', { pathname, hasToken: !!token });
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For paid-only and admin routes, we'll check on the page itself
  // since we need to verify the JWT token and check user role/tier
  // Middleware doesn't have easy access to verify JWT without external libs

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

