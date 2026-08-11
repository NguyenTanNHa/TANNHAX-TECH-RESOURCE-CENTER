import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  response.cookies.set({
    name: 'admin_token',
    value: '',
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  response.cookies.set({
    name: 'tannhax_admin_auth',
    value: '',
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  
  return response;
}
