export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export function middleware(request) {
  const secret = process.env.JWT_SECRET;
  const cookie = request.cookies.get('ourSiteAuth');
  const loginUrl = new URL('/login', request.url);

  if (!cookie) return NextResponse.redirect(loginUrl);

  try {
    verify(cookie.value, secret);
    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
