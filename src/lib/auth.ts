import { jwtVerify, SignJWT } from 'jose';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only_123456';
const key = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function verifyAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return false;
  
  try {
    await jwtVerify(token, key);
    return true;
  } catch (err) {
    return false;
  }
}
