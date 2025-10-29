// app/api/auth/logout/route.js

import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

export async function POST() {
  // Create a cookie with the same name but an expired maxAge
  const serializedCookie = serialize('ourSiteAuth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1, // Expire the cookie immediately
    path: '/',
  });

  return NextResponse.json(
    { message: 'Logged out' },
    {
      status: 200,
      headers: { 'Set-Cookie': serializedCookie },
    }
  );
}