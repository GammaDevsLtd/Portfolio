import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export function middleware(request) {
  const secret = process.env.JWT_SECRET || '';
  const cookie = request.cookies.get('ourSiteAuth');
  const loginUrl = new URL('/login', request.url);

  // If no cookie is found, redirect to the login page
  if (!cookie) {
    return NextResponse.redirect(loginUrl);
  }

  // If a cookie is found, verify the JWT
  try {
    // verify() will throw an error if the token is invalid
    verify(cookie.value, secret);
    
    // Token is valid, allow the request to continue
    return NextResponse.next();
  } catch (error) {
    // Token is invalid, redirect to the login page
    return NextResponse.redirect(loginUrl);
  }
}

// Config to specify which routes this middleware should protect
export const config = {
  matcher: ['/admin/:path*'], // Protects all routes inside the /admin directory
};