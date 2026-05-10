import { SignJWT, jwtVerify } from 'jose';
import { hash, compare } from 'bcryptjs';
import { cookies } from 'next/headers';
import { env } from './env';
import crypto from 'crypto';

const COOKIE_NAME = 'strata_session';
const TOKEN_EXPIRY = '7d';

function getSecretKey() {
  return new TextEncoder().encode(env.jwtSecret());
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return compare(password, hashed);
}

export async function createSessionToken(customerId: string): Promise<string> {
  return new SignJWT({ sub: customerId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return (payload.sub as string) ?? null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(customerId: string) {
  const token = await createSessionToken(customerId);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function getSessionCustomerId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function otpHashSecret(): string {
  return env.jwtSecret();
}

export function hashOtp(code: string): string {
  return crypto.createHmac('sha256', otpHashSecret()).update(code).digest('hex');
}

export function verifyOtp(code: string, hashed: string): boolean {
  const computed = hashOtp(code);
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hashed));
}
