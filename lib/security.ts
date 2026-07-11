/**
 * Lightweight anti-abuse helpers for the public API routes:
 *  - honeypot check (a hidden field bots tend to fill)
 *  - in-memory rate limit (per IP, per route)
 *  - optional Cloudflare Turnstile verification
 *
 * The in-memory limiter is per-instance; for multi-region production, back it
 * with Upstash Redis (see DEPLOIEMENT.md). It still stops naive floods well.
 */

const BUCKET = new Map<string, { count: number; resetAt: number }>();

export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

/** Returns true if the request is allowed, false if the limit is exceeded. */
export function rateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = BUCKET.get(key);
  if (!entry || now > entry.resetAt) {
    BUCKET.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

/** True when the honeypot was triggered (i.e. likely a bot). */
export function isHoneypotTripped(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function verifyTurnstile(token: unknown): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Not configured → skip (dev / not required yet).
  if (typeof token !== 'string' || !token) return false;
  try {
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret, response: token }),
      },
    );
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export function isValidEmail(email: unknown): email is string {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
