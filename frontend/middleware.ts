import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  'super_secret_echo_hire_key_2024'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('echohire-session')?.value;

  // 1. PUBLIC ROUTES: Always accessible
  const publicRoutes = ['/', '/403', '/recruiter'];
  const publicPrefixes = ['/auth', '/api', '/features', '/pricing', '/about', '/contact', '/students', '/privacy', '/terms', '/forgot-password', '/reset-password'];
  
  const isPublicRoute = publicRoutes.includes(pathname) || publicPrefixes.some(p => pathname.startsWith(p));
  
  // 2. AUTHENTICATED USER HITTING /AUTH: Redirect to their dashboard
  if (pathname.startsWith('/auth') && token) {
    try {
      const { payload } = await jwtVerify(token, SECRET);
      const role = payload.role as string;
      return NextResponse.redirect(new URL(getDashboardRoute(role), request.url));
    } catch {
      // Invalid token, allow access to auth
    }
  }

  if (isPublicRoute) return NextResponse.next();

  // 3. PROTECTED ROUTES: Check authentication
  if (!token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const role = payload.role as string;

    // 4. ROLE FENCING
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/403', request.url));
    }
    if (pathname.startsWith('/recruiter') && role !== 'recruiter' && role !== 'admin') {
      return NextResponse.redirect(new URL('/403', request.url));
    }
    if (pathname.startsWith('/candidate') && role !== 'candidate' && role !== 'admin') {
      return NextResponse.redirect(new URL('/403', request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error('Middleware JWT Error:', err);
    return NextResponse.redirect(new URL('/auth', request.url));
  }
}

function getDashboardRoute(role: string) {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'recruiter': return '/recruiter/dashboard';
    case 'candidate': return '/candidate/dashboard';
    default: return '/';
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
