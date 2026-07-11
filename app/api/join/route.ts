import { NextResponse } from 'next/server';
import { addMember, countMembers } from '@/lib/db';
import { sendMembershipConfirmation, notifyNewMember } from '@/lib/email';
import {
  clientIp,
  rateLimit,
  isHoneypotTripped,
  verifyTurnstile,
  isValidEmail,
} from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`join:${ip}`, 5, 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  // Honeypot — silently accept so bots don't learn, but do nothing.
  if (isHoneypotTripped(body.website)) {
    return NextResponse.json({ ok: true, count: await safeCount() });
  }

  if (!(await verifyTurnstile(body.turnstileToken))) {
    return NextResponse.json({ ok: false, error: 'captcha' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  if (!name || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'validation' }, { status: 422 });
  }

  const locale = body.locale === 'en' ? 'en' : 'fr';

  try {
    const member = await addMember({
      name,
      email,
      promotion: String(body.promotion ?? '').trim() || undefined,
      city: String(body.city ?? '').trim() || undefined,
      message: String(body.message ?? '').trim() || undefined,
      locale,
    });

    // Emails are best-effort — a delivery hiccup must not fail the signup.
    Promise.allSettled([
      sendMembershipConfirmation({ name, email, locale }),
      notifyNewMember({ name, email, promotion: member.promotion, city: member.city }),
    ]).catch(() => {});

    return NextResponse.json({ ok: true, count: await safeCount() });
  } catch (err) {
    console.error('[join] error', err);
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 });
  }
}

async function safeCount(): Promise<number | null> {
  try {
    return await countMembers();
  } catch {
    return null;
  }
}
