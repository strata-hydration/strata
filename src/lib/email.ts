import nodemailer from 'nodemailer';
import { formatINR } from './utils';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

interface OrderEmailData {
  orderId: string;
  email: string;
  customerName: string;
  items: { productName: string; quantity: number; pricePaise: number }[];
  subtotalPaise: number;
  shippingPaise: number;
  totalPaise: number;
  shippingAddress: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('Email not configured — skipping order confirmation email');
    return;
  }

  const shortId = data.orderId.slice(0, 8).toUpperCase();

  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155;">
          ${item.productName}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#64748b;text-align:center;">
          ${item.quantity}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155;text-align:right;font-weight:600;">
          ${formatINR(item.pricePaise * item.quantity)}
        </td>
      </tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f5ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0077FF,#00C8FF);border-radius:20px 20px 0 0;padding:32px 24px;text-align:center;">
      <h1 style="color:#fff;font-size:28px;font-weight:900;margin:0;letter-spacing:-0.5px;">STRATA</h1>
      <p style="color:rgba(255,255,255,0.85);font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:4px 0 0;">Hydration</p>
    </div>

    <!-- Body -->
    <div style="background:#fff;border-radius:0 0 20px 20px;padding:32px 24px;box-shadow:0 8px 32px rgba(0,80,160,0.08);">

      <!-- Success icon -->
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;width:56px;height:56px;line-height:56px;border-radius:50%;background:#dcfce7;color:#22c55e;font-size:24px;">✓</div>
      </div>

      <h2 style="color:#0f172a;font-size:22px;font-weight:800;text-align:center;margin:0 0 8px;">Order Confirmed!</h2>
      <p style="color:#64748b;font-size:14px;text-align:center;margin:0 0 24px;">
        Hi ${data.customerName}, thank you for your order. We&apos;re getting it ready!
      </p>

      <!-- Order ID -->
      <div style="background:#f0f5ff;border:1px solid #dbeafe;border-radius:12px;padding:12px 16px;text-align:center;margin-bottom:24px;">
        <span style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">Order ID</span><br>
        <span style="color:#0f172a;font-size:18px;font-weight:800;font-family:monospace;">#${shortId}</span>
      </div>

      <!-- Items table -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:10px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:700;">Item</th>
            <th style="padding:10px 16px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:700;">Qty</th>
            <th style="padding:10px 16px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:700;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="border-top:2px solid #f1f5f9;padding-top:16px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;font-size:14px;color:#64748b;">Subtotal</td>
            <td style="padding:6px 0;font-size:14px;color:#334155;text-align:right;font-weight:500;">${formatINR(data.subtotalPaise)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:14px;color:#64748b;">Shipping</td>
            <td style="padding:6px 0;font-size:14px;color:${data.shippingPaise === 0 ? '#22c55e' : '#334155'};text-align:right;font-weight:500;">${data.shippingPaise === 0 ? 'Free' : formatINR(data.shippingPaise)}</td>
          </tr>
          <tr>
            <td style="padding:12px 0 6px;font-size:18px;color:#0f172a;font-weight:800;border-top:2px solid #e2e8f0;">Total</td>
            <td style="padding:12px 0 6px;font-size:18px;color:#0f172a;font-weight:800;text-align:right;border-top:2px solid #e2e8f0;">${formatINR(data.totalPaise)}</td>
          </tr>
        </table>
      </div>

      <!-- Shipping address -->
      <div style="margin-top:24px;background:#f8fafc;border-radius:12px;padding:16px;">
        <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;font-weight:700;">Delivering to</p>
        <p style="margin:0;font-size:14px;color:#334155;line-height:1.6;">
          ${data.shippingAddress.fullName}<br>
          ${data.shippingAddress.line1}${data.shippingAddress.line2 ? `, ${data.shippingAddress.line2}` : ''}<br>
          ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.pincode}
        </p>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-top:28px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order/${data.orderId}"
           style="display:inline-block;background:linear-gradient(135deg,#0077FF,#00C8FF);color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:50px;letter-spacing:0.5px;text-transform:uppercase;">
          Track Your Order →
        </a>
      </div>

      <!-- Delivery info -->
      <p style="margin:24px 0 0;text-align:center;font-size:12px;color:#94a3b8;">
        📦 Estimated delivery: 3–5 business days · 🚚 Flat ₹49 shipping (free above ₹499)
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 16px;">
      <p style="color:#94a3b8;font-size:11px;margin:0;">
        STRATA Hydration · Electrolyte Drink Mix · No Added Sugar<br>
        Questions? Reply to this email or contact hello@stratahydration.com
      </p>
    </div>
  </div>
</body>
</html>`;

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"STRATA Hydration" <${process.env.GMAIL_USER}>`,
    to: data.email,
    subject: `Order Confirmed #${shortId} — STRATA Hydration`,
    html,
    text: `Order Confirmed!\n\nOrder ID: #${shortId}\n\nItems:\n${data.items.map((i) => `${i.productName} × ${i.quantity} — ${formatINR(i.pricePaise * i.quantity)}`).join('\n')}\n\nTotal: ${formatINR(data.totalPaise)}\n\nShipping to: ${data.shippingAddress.fullName}, ${data.shippingAddress.line1}, ${data.shippingAddress.city} ${data.shippingAddress.pincode}\n\nTrack your order: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order/${data.orderId}`,
  });
}

interface ContactNotificationData {
  name: string;
  email: string;
  message: string;
}

export async function sendContactNotification(data: ContactNotificationData) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('Email not configured — skipping contact notification');
    return;
  }

  const contactInbox = process.env.CONTACT_INBOX_EMAIL || 'hello@stratahydration.com';
  const safeName = escapeHtml(data.name.trim());
  const safeEmail = escapeHtml(data.email.trim());
  const safeMessage = escapeHtml(data.message.trim());
  const firstName = safeName.split(' ')[0] || 'there';
  const inquiryId = `RF-${Date.now().toString(36).toUpperCase()}`;
  const receivedAt = new Date();
  const receivedAtLabel = receivedAt.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });

  const internalHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f5ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:640px;margin:0 auto;padding:32px 16px;">

    <div style="background:linear-gradient(140deg,#041E3D,#0A3D75 48%,#0FA8FF);border-radius:18px 18px 0 0;padding:26px;text-align:center;">
      <p style="margin:0;color:#bae6fd;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">STRATA Concierge</p>
      <h1 style="color:#fff;font-size:23px;font-weight:900;margin:8px 0 0;letter-spacing:-0.5px;">New Premium Inquiry</h1>
    </div>

    <div style="background:#fff;border-radius:0 0 18px 18px;padding:24px;box-shadow:0 10px 34px rgba(1,34,76,0.12);">
      <div style="margin:0 0 16px;padding:12px 14px;border-radius:12px;background:#eff6ff;border:1px solid #dbeafe;">
        <span style="display:block;font-size:11px;text-transform:uppercase;letter-spacing:1.6px;color:#475569;font-weight:700;">Inquiry ID</span>
        <span style="display:block;margin-top:4px;font-size:18px;letter-spacing:0.4px;color:#0f172a;font-weight:900;font-family:monospace;">${inquiryId}</span>
      </div>

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;font-size:11px;text-transform:uppercase;letter-spacing:1.4px;color:#94a3b8;font-weight:700;width:96px;vertical-align:top;">From</td>
          <td style="padding:10px 0;font-size:15px;color:#0f172a;font-weight:700;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:11px;text-transform:uppercase;letter-spacing:1.4px;color:#94a3b8;font-weight:700;vertical-align:top;">Email</td>
          <td style="padding:10px 0;font-size:15px;color:#0077FF;">
            <a href="mailto:${safeEmail}" style="color:#0077FF;text-decoration:none;">${safeEmail}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:11px;text-transform:uppercase;letter-spacing:1.4px;color:#94a3b8;font-weight:700;vertical-align:top;">Received</td>
          <td style="padding:10px 0;font-size:14px;color:#334155;">${receivedAtLabel} IST</td>
        </tr>
      </table>

      <div style="margin-top:16px;border-top:1px solid #f1f5f9;padding-top:16px;">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:1.4px;color:#94a3b8;font-weight:700;margin:0 0 8px;">Message</p>
        <div style="background:#f8fafc;border-radius:12px;padding:16px;border:1px solid #e2e8f0;">
          <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
        </div>
      </div>

      <div style="margin-top:20px;text-align:center;">
        <a href="mailto:${safeEmail}?subject=Re: Your message to STRATA Hydration"
           style="display:inline-block;background:linear-gradient(135deg,#0077FF,#00B8FF);color:#fff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:50px;text-transform:uppercase;letter-spacing:0.6px;">
          Reply to ${firstName} →
        </a>
      </div>
    </div>

    <p style="text-align:center;color:#94a3b8;font-size:10px;margin-top:16px;">
      Received via STRATA Refuel form · Customer is CC&apos;d on this thread
    </p>
  </div>
</body>
</html>`;

  const customerHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#eff7ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:620px;margin:0 auto;padding:30px 16px;">
    <div style="background:linear-gradient(135deg,#0B2E5B 0%,#0077FF 50%,#00D4FF 100%);border-radius:20px 20px 0 0;padding:30px 24px;text-align:center;">
      <h1 style="color:#fff;font-size:27px;font-weight:900;margin:0;letter-spacing:-0.5px;">STRATA</h1>
      <p style="color:rgba(255,255,255,0.85);font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:6px 0 0;">Hydration Concierge</p>
    </div>
    <div style="background:#fff;border-radius:0 0 20px 20px;padding:30px 24px;box-shadow:0 10px 36px rgba(2,44,92,0.12);">
      <h2 style="margin:0 0 8px;color:#0f172a;font-size:24px;font-weight:800;">Thanks for reaching out, ${firstName}</h2>
      <p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.7;">
        Your message has reached our team. We usually respond within 24 hours with a tailored response.
      </p>

      <div style="border:1px solid #dbeafe;border-radius:14px;background:linear-gradient(180deg,#f8fbff,#f0f7ff);padding:14px 16px;margin-bottom:18px;">
        <span style="display:block;color:#64748b;font-size:11px;letter-spacing:1.4px;text-transform:uppercase;font-weight:700;">Reference</span>
        <span style="display:block;margin-top:4px;color:#0f172a;font-family:monospace;font-size:18px;font-weight:900;">${inquiryId}</span>
      </div>

      <div style="padding:16px;border-radius:14px;background:#f8fafc;border:1px solid #e2e8f0;">
        <p style="margin:0 0 6px;color:#94a3b8;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;">Your message</p>
        <p style="margin:0;color:#334155;font-size:14px;line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
      </div>

      <p style="margin:18px 0 0;color:#64748b;font-size:13px;line-height:1.7;">
        This email is your copy for reference. You can simply reply to this thread for any updates.
      </p>
    </div>
    <p style="margin:14px 0 0;text-align:center;color:#94a3b8;font-size:10px;">
      STRATA Hydration · Premium electrolyte experience
    </p>
  </div>
</body>
</html>`;

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"STRATA Concierge" <${process.env.GMAIL_USER}>`,
    to: contactInbox,
    cc: data.email,
    replyTo: data.email,
    subject: `New Refuel Inquiry ${inquiryId} — ${data.name}`,
    html: internalHtml,
    text: `New Refuel Inquiry\n\nReference: ${inquiryId}\nFrom: ${data.name}\nEmail: ${data.email}\nReceived: ${receivedAtLabel} IST\n\nMessage:\n${data.message}\n\nCustomer is CC'd in this thread.`,
  });

  await transporter.sendMail({
    from: `"STRATA Concierge" <${process.env.GMAIL_USER}>`,
    to: data.email,
    replyTo: contactInbox,
    subject: `We received your message — ${inquiryId}`,
    html: customerHtml,
    text: `Hi ${data.name},\n\nThank you for contacting STRATA Hydration.\n\nReference: ${inquiryId}\n\nWe typically reply within 24 hours.\n\nYour message:\n${data.message}\n\nRegards,\nSTRATA Concierge`,
  });
}

interface OtpEmailData {
  email: string;
  name?: string;
  otp: string;
  purpose: 'signup' | 'reset';
}

export async function sendOtpEmail(data: OtpEmailData) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('Email not configured — skipping OTP email');
    return;
  }

  const title = data.purpose === 'signup' ? 'Verify Your Email' : 'Reset Your Password';
  const subtitle = data.purpose === 'signup'
    ? 'Complete your STRATA account setup with this one-time code.'
    : 'Use this one-time code to reset your STRATA password.';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f5ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:28px 16px;">
    <div style="background:linear-gradient(135deg,#0077FF,#00C8FF);border-radius:18px 18px 0 0;padding:26px;text-align:center;">
      <h1 style="color:#fff;font-size:22px;font-weight:900;margin:0;">STRATA</h1>
      <p style="color:rgba(255,255,255,0.88);font-size:12px;letter-spacing:1.5px;text-transform:uppercase;margin:4px 0 0;">Hydration</p>
    </div>
    <div style="background:#fff;border-radius:0 0 18px 18px;padding:24px;box-shadow:0 8px 32px rgba(0,80,160,0.08);text-align:center;">
      <h2 style="color:#0f172a;font-size:20px;margin:0 0 8px;">${title}</h2>
      <p style="color:#64748b;font-size:14px;margin:0 0 18px;">${subtitle}</p>
      <div style="display:inline-block;padding:12px 20px;border-radius:12px;background:#f0f5ff;border:1px solid #dbeafe;">
        <span style="font-family:monospace;font-size:30px;letter-spacing:6px;color:#0f172a;font-weight:800;">${data.otp}</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:16px 0 0;">This code expires in 10 minutes and can only be used once.</p>
    </div>
  </div>
</body>
</html>`;

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"STRATA Security" <${process.env.GMAIL_USER}>`,
    to: data.email,
    subject: `${title} OTP: ${data.otp}`,
    html,
    text: `${title}\n\nYour OTP code is: ${data.otp}\n\nThis code expires in 10 minutes and can only be used once.`,
  });
}
