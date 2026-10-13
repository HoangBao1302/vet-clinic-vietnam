import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/downloads',
  '/profile',
  '/affiliate/apply',
  '/affiliate/dashboard',
  '/affiliate/payment-request',
  '/dashboard',
];

const paidOnlyRoutes = [
  '/members/signals',
  '/members/webinars',
  '/members/community',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  if (pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.search = `?redirect=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPaidOnlyRoute = paidOnlyRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute || isPaidOnlyRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
