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
      return new NextResponse('Not Found', {
        status: 404,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });
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
