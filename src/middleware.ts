
import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = ['/admin'];
const publicRoutes = ['/admin/login'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('firebaseIdToken');
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(p => pathname.startsWith(p));
  const isPublicRoute = publicRoutes.some(p => pathname.startsWith(p));

  if (isProtectedRoute && !isPublicRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
