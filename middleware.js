import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const secret = process.env.JWT_SECRET;
  const cookie = request.cookies.get('ourSiteAuth');
  const loginUrl = new URL('/login', request.url);

  // 1. If there's no cookie, redirect to login
  if (!cookie) {
    return NextResponse.redirect(loginUrl);
  }

  // 2. We have a cookie, let's verify it
  try {
    // Get the cookie value
    const token = cookie.value;

    // Encode the secret
    const secretKey = new TextEncoder().encode(secret);

    // Verify the token
    await jwtVerify(token, secretKey);

    // If verification is successful, let the request continue
    return NextResponse.next();

  } catch (error) {
    // 3. If verification fails (expired, invalid, etc.), redirect to login
    console.error("JWT verification failed:", error.message);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};