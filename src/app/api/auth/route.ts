import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import {
  loginSchema,
  requestSignupOtpSchema,
  verifySignupOtpSchema,
  forgotPasswordRequestSchema,
  forgotPasswordVerifySchema,
} from '@/lib/validation';
import {
  hashPassword,
  verifyPassword,
  setSessionCookie,
  clearSessionCookie,
  getSessionCustomerId,
  generateOtpCode,
  hashOtp,
  verifyOtp,
} from '@/lib/auth';
import { sendOtpEmail } from '@/lib/email';
import { v4 as uuid } from 'uuid';

// POST /api/auth — actions: login/logout/me + OTP signup + OTP password reset
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...data } = body;
    const db = getDb();

    if (action === 'signup_request_otp') {
      const parsed = requestSignupOtpSchema.safeParse(data);
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors }, { status: 400 });
      }
      const { email, password, name } = parsed.data;

      const existing = db.prepare('SELECT id FROM customers WHERE email = ?').get(email);
      if (existing) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      }

      const passwordHash = await hashPassword(password);
      const otp = generateOtpCode();
      const otpHash = hashOtp(otp);

      db.prepare('DELETE FROM auth_otps WHERE email = ? AND purpose = ?').run(email, 'signup_verify');
      db.prepare(
        `INSERT INTO auth_otps (id, email, purpose, code_hash, payload, expires_at)
         VALUES (?, ?, 'signup_verify', ?, ?, datetime('now', '+10 minutes'))`
      ).run(uuid(), email, otpHash, JSON.stringify({ name, passwordHash }));

      await sendOtpEmail({ email, name, otp, purpose: 'signup' });

      return NextResponse.json({ data: { message: 'OTP sent to your email' } }, { status: 200 });
    }

    if (action === 'signup_verify_otp') {
      const parsed = verifySignupOtpSchema.safeParse(data);
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors }, { status: 400 });
      }
      const { email, otp } = parsed.data;

      const otpRow = db.prepare(
        `SELECT * FROM auth_otps
         WHERE email = ? AND purpose = 'signup_verify' AND consumed_at IS NULL AND expires_at > datetime('now')
         ORDER BY created_at DESC LIMIT 1`
      ).get(email) as Record<string, unknown> | undefined;

      if (!otpRow) {
        return NextResponse.json({ error: 'OTP expired or not found. Request a new one.' }, { status: 400 });
      }

      if (!verifyOtp(otp, otpRow.code_hash as string)) {
        db.prepare('UPDATE auth_otps SET attempts = attempts + 1 WHERE id = ?').run(otpRow.id);
        return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
      }

      const payload = JSON.parse((otpRow.payload as string) || '{}') as { name?: string; passwordHash?: string };
      if (!payload.name || !payload.passwordHash) {
        return NextResponse.json({ error: 'Signup session invalid. Please retry.' }, { status: 400 });
      }

      const existing = db.prepare('SELECT id FROM customers WHERE email = ?').get(email);
      if (existing) {
        db.prepare('UPDATE auth_otps SET consumed_at = datetime(\'now\') WHERE id = ?').run(otpRow.id);
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      }

      const id = uuid();
      db.prepare(
        'INSERT INTO customers (id, email, name, password_hash, email_verified) VALUES (?, ?, ?, ?, 1)'
      ).run(id, email, payload.name, payload.passwordHash);

      db.prepare('UPDATE auth_otps SET consumed_at = datetime(\'now\') WHERE id = ?').run(otpRow.id);

      await setSessionCookie(id);
      return NextResponse.json({ data: { id, email, name: payload.name } }, { status: 201 });
    }

    if (action === 'login') {
      const parsed = loginSchema.safeParse(data);
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors }, { status: 400 });
      }
      const { email, password } = parsed.data;
      const customer = db.prepare('SELECT * FROM customers WHERE email = ?').get(email) as Record<string, unknown> | undefined;
      if (!customer) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      if (customer.email_verified !== 1) {
        return NextResponse.json({ error: 'Please verify your email before signing in' }, { status: 403 });
      }

      const valid = await verifyPassword(password, customer.password_hash as string);
      if (!valid) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      await setSessionCookie(customer.id as string);
      return NextResponse.json({ data: { id: customer.id, email: customer.email, name: customer.name } });
    }

    if (action === 'forgot_password_request_otp') {
      const parsed = forgotPasswordRequestSchema.safeParse(data);
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors }, { status: 400 });
      }

      const { email } = parsed.data;
      const customer = db.prepare('SELECT id, name FROM customers WHERE email = ?').get(email) as Record<string, unknown> | undefined;
      if (customer) {
        const otp = generateOtpCode();
        const otpHash = hashOtp(otp);
        db.prepare('DELETE FROM auth_otps WHERE email = ? AND purpose = ?').run(email, 'password_reset');
        db.prepare(
          `INSERT INTO auth_otps (id, email, purpose, code_hash, expires_at)
           VALUES (?, ?, 'password_reset', ?, datetime('now', '+10 minutes'))`
        ).run(uuid(), email, otpHash);
        await sendOtpEmail({ email, name: customer.name as string, otp, purpose: 'reset' });
      }

      return NextResponse.json({ data: { message: 'If that email exists, OTP has been sent.' } });
    }

    if (action === 'forgot_password_verify_otp') {
      const parsed = forgotPasswordVerifySchema.safeParse(data);
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors }, { status: 400 });
      }

      const { email, otp, newPassword } = parsed.data;
      const otpRow = db.prepare(
        `SELECT * FROM auth_otps
         WHERE email = ? AND purpose = 'password_reset' AND consumed_at IS NULL AND expires_at > datetime('now')
         ORDER BY created_at DESC LIMIT 1`
      ).get(email) as Record<string, unknown> | undefined;

      if (!otpRow) {
        return NextResponse.json({ error: 'OTP expired or not found. Request a new one.' }, { status: 400 });
      }

      if (!verifyOtp(otp, otpRow.code_hash as string)) {
        db.prepare('UPDATE auth_otps SET attempts = attempts + 1 WHERE id = ?').run(otpRow.id);
        return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
      }

      const customer = db.prepare('SELECT id FROM customers WHERE email = ?').get(email) as Record<string, unknown> | undefined;
      if (!customer) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 });
      }

      const passwordHash = await hashPassword(newPassword);
      db.prepare('UPDATE customers SET password_hash = ?, email_verified = 1 WHERE id = ?').run(passwordHash, customer.id);
      db.prepare('UPDATE auth_otps SET consumed_at = datetime(\'now\') WHERE id = ?').run(otpRow.id);

      await setSessionCookie(customer.id as string);
      return NextResponse.json({ data: { id: customer.id, email } });
    }

    if (action === 'logout') {
      await clearSessionCookie();
      return NextResponse.json({ data: { success: true } });
    }

    if (action === 'me') {
      const customerId = await getSessionCustomerId();
      if (!customerId) {
        return NextResponse.json({ data: null });
      }
      const customer = db.prepare('SELECT id, email, name, email_verified, created_at FROM customers WHERE id = ?').get(customerId) as Record<string, unknown> | undefined;
      if (!customer) {
        await clearSessionCookie();
        return NextResponse.json({ data: null });
      }
      return NextResponse.json({
        data: {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          emailVerified: customer.email_verified === 1,
        },
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('POST /api/auth error:', err);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
