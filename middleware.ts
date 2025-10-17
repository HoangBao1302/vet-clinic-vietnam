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
  '/admin/affiliates',
  '/admin/conversions',
  '/admin/users',
  '/admin/newsletter',
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
    
    // For downloads route, always let it through - let client-side handle auth
    // This prevents middleware redirect loops when localStorage has token but cookie doesn't
    console.log('Downloads: Letting through to client-side auth check');
    return NextResponse.next();
  }

  // Redirect to login if accessing protected route without token
  if ((isProtectedRoute || isPaidOnlyRoute || isAdminOnlyRoute) && !token) {
    console.log('Redirecting to login:', { pathname, hasToken: !!token });
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For admin routes, check if user has admin role
  if (isAdminOnlyRoute && token) {
    try {
      // Simple JWT decode without verification (just for role check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'admin') {
        console.log('Non-admin user trying to access admin route:', { pathname, userRole: payload.role });
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch (error) {
      console.log('Invalid token for admin route:', { pathname, error: error.message });
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

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

