import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const { email, password } = body;
  console.log(body);

  // IMPORTANT: Check credentials against your environment variables
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const secret = process.env.JWT_SECRET || '';

  // Create the JWT with a payload and expiration time
  const token = sign(
    {
      email: email,
      role: 'admin',
    },
    secret,
    { expiresIn: '1h' } // Token is valid for 1 hour
  );

  // Serialize the token into a secure, httpOnly cookie
  const serializedCookie = serialize('ourSiteAuth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 hour in seconds
    path: '/',
  });

  // Return a success message and set the cookie in the headers
  return NextResponse.json(
    { message: 'Authenticated!' },
    {
      status: 200,
      headers: { 'Set-Cookie': serializedCookie },
    }
  );
}