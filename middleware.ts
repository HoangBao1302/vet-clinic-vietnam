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

  // For protected routes, let client-side handle authentication
  // This prevents middleware redirect loops when localStorage has token but cookie doesn't
  if (isProtectedRoute || isPaidOnlyRoute || isAdminOnlyRoute) {
    console.log('Protected route: Letting through to client-side auth check', { pathname });
    return NextResponse.next();
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

