import { NextRequest, NextResponse } from 'next/server';
import { sendContactNotification } from '@/lib/email';

const ALLOWED_FIELDS = ['name', 'email', 'message'] as const;
const MAX_LENGTH = { name: 100, email: 254, message: 2000 };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Validate required fields
    for (const field of ALLOWED_FIELDS) {
      if (!body[field] || typeof body[field] !== 'string' || !body[field].trim()) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
      if (body[field].length > MAX_LENGTH[field]) {
        return NextResponse.json({ error: `${field} is too long` }, { status: 400 });
      }
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    await sendContactNotification({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    return NextResponse.json({ success: true });
  } catch {
    console.error('Contact form error');
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
