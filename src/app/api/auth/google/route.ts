import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuid } from 'uuid';
import { setSessionCookie } from '@/lib/auth';

interface GoogleTokenPayload {
  sub: string;
  email: string;
  name: string;
  email_verified: boolean;
  picture?: string;
}

async function verifyGoogleToken(credential: string): Promise<GoogleTokenPayload> {
  // Decode the JWT header to get kid, then verify with Google's public keys
  const parts = credential.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');

  // Fetch Google's public keys
  const certsRes = await fetch('https://www.googleapis.com/oauth2/v3/certs', {
    next: { revalidate: 3600 },
  });
  const certs = await certsRes.json();

  // Decode header to find the matching key
  const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
  const key = certs.keys.find((k: { kid: string }) => k.kid === header.kid);
  if (!key) throw new Error('Invalid token signing key');

  // Import the JWK and verify
  const { jwtVerify, importJWK } = await import('jose');
  const publicKey = await importJWK(key, header.alg);
  const { payload } = await jwtVerify(credential, publicKey, {
    issuer: ['https://accounts.google.com', 'accounts.google.com'],
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  return {
    sub: payload.sub as string,
    email: payload.email as string,
    name: payload.name as string,
    email_verified: payload.email_verified as boolean,
    picture: payload.picture as string | undefined,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { credential } = await req.json();
    if (!credential || typeof credential !== 'string') {
      return NextResponse.json({ error: 'Missing Google credential' }, { status: 400 });
    }

    const googleUser = await verifyGoogleToken(credential);
    if (!googleUser.email_verified) {
      return NextResponse.json({ error: 'Google email not verified' }, { status: 400 });
    }

    const db = getDb();

    // Check if customer exists
    let customer = db
      .prepare('SELECT id, email, name FROM customers WHERE email = ?')
      .get(googleUser.email) as { id: string; email: string; name: string } | undefined;

    if (!customer) {
      // Auto-create account from Google profile — no password needed
      const id = uuid();
      db.prepare(
        `INSERT INTO customers (id, email, name, password_hash, email_verified)
         VALUES (?, ?, ?, 'google_sso', 1)`
      ).run(id, googleUser.email, googleUser.name);
      customer = { id, email: googleUser.email, name: googleUser.name };
    }

    await setSessionCookie(customer.id);

    return NextResponse.json({
      data: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
      },
    });
  } catch (err) {
    console.error('Google SSO error:', err);
    return NextResponse.json({ error: 'Google authentication failed' }, { status: 500 });
  }
}
