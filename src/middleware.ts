import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // ── Security headers for all responses ──
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(self)'
  );

  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://accounts.google.com https://apis.google.com https://www.googletagmanager.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https: https://www.google-analytics.com https://www.googletagmanager.com",
        "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://accounts.google.com https://www.googleapis.com https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
        "frame-src https://api.razorpay.com https://checkout.razorpay.com https://accounts.google.com",
        "object-src 'none'",
        "base-uri 'self'",
      ].join('; ')
    );
  }

  // ── API-specific headers ──
  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

    // CORS for API routes (same-origin in production)
    const origin = request.headers.get('origin');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    if (origin === baseUrl) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    }

    // Block OPTIONS preflight if origin not allowed
    if (request.method === 'OPTIONS') {
      if (origin !== baseUrl) {
        return new NextResponse(null, { status: 403 });
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)'],
};
