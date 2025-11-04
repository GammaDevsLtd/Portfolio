import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, password } = await request.json();

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const secret = process.env.JWT_SECRET;

  const token = sign({ email, role: 'admin' }, secret, { expiresIn: '1h' });

  const serializedCookie = serialize('ourSiteAuth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60,
    path: '/',
  });

  return NextResponse.json(
    { message: 'Authenticated!' },
    { status: 200, headers: { 'Set-Cookie': serializedCookie } }
  );
}
