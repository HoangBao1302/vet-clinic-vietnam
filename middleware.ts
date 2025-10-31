import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './routing';

// Create next-intl middleware with routing config
const intlMiddleware = createMiddleware(routing);

// Routes that require authentication
const protectedRoutes = [
  '/downloads',
  '/profile',
  '/affiliate/apply',
  '/affiliate/dashboard',
  '/affiliate/payment-request',
  '/dashboard',
];

// Routes that require paid membership
const paidOnlyRoutes = [
  '/members/signals',
  '/members/webinars',
  '/members/community',
];

// Admin only routes - These should NOT have locale prefix
const adminOnlyRoutes = [
  '/admin',
];

// Staff can access blog management
const staffAllowedRoutes = [
  '/admin/blog',
  '/admin/blog/create',
  '/admin/blog/edit',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle root path - redirect to default locale (vi)
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/vi', request.url));
  }

  // Exclude admin routes from locale routing - keep them as /admin (always Vietnamese)
  if (pathname.startsWith('/admin')) {
    // Handle basic auth for admin license routes
    if (pathname.startsWith('/admin/licenses')) {
      const auth = request.headers.get("authorization") || "";
      const [scheme, encoded] = auth.split(" ");
      if (scheme !== "Basic" || !encoded) {
        return new NextResponse("Auth required", {
          status: 401,
          headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' }
        });
      }

      const [user, pass] = Buffer.from(encoded, "base64").toString().split(":");
      if (user !== process.env.BASIC_AUTH_USER || pass !== process.env.BASIC_AUTH_PASS) {
        return new NextResponse("Forbidden", { status: 403 });
      }

      return NextResponse.next();
    }

    // For other admin routes, let through (client-side will handle auth)
    return NextResponse.next();
  }

  // Exclude API routes, static files, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Apply next-intl middleware for all other routes
  return intlMiddleware(request);
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

