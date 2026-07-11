import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { addContribution } from '@/lib/db';
import { notifyNewContribution } from '@/lib/email';
import {
  clientIp,
  rateLimit,
  isHoneypotTripped,
  verifyTurnstile,
  isValidEmail,
} from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILE = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`contribute:${ip}`, 4, 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  if (isHoneypotTripped(form.get('website'))) {
    return NextResponse.json({ ok: true });
  }
  if (!(await verifyTurnstile(form.get('turnstileToken')))) {
    return NextResponse.json({ ok: false, error: 'captcha' }, { status: 400 });
  }

  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const kind = String(form.get('kind') ?? 'photo').trim();
  const title = String(form.get('title') ?? '').trim();
  const story = String(form.get('story') ?? '').trim();
  const consent = form.get('consent') === 'on' || form.get('consent') === 'true';
  const locale = form.get('locale') === 'en' ? 'en' : 'fr';

  if (!name || !isValidEmail(email) || !title || !consent) {
    return NextResponse.json({ ok: false, error: 'validation' }, { status: 422 });
  }

  // Optional file upload.
  let fileUrl: string | undefined;
  const file = form.get('file');
  if (file && typeof file === 'object' && 'arrayBuffer' in file) {
    const f = file as File;
    if (f.size > 0) {
      if (f.size > MAX_FILE || !ALLOWED.includes(f.type)) {
        return NextResponse.json({ ok: false, error: 'file' }, { status: 422 });
      }
      try {
        fileUrl = await storeFile(f);
      } catch (err) {
        console.error('[contribute] file store failed', err);
        // Non-fatal: keep the testimony even if the file could not be saved.
      }
    }
  }

  try {
    const contribution = await addContribution({
      name,
      email,
      kind,
      title,
      story,
      fileUrl,
      locale,
    });
    notifyNewContribution({ name, email, kind, title }).catch(() => {});
    return NextResponse.json({ ok: true, id: contribution.id });
  } catch (err) {
    console.error('[contribute] error', err);
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 });
  }
}

/**
 * Store an uploaded file.
 * • Supabase Storage bucket "contributions" when configured.
 * • Otherwise the local /public/uploads folder (dev only).
 */
async function storeFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
  const key = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}.${ext}`;

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createClient } = await import('@supabase/supabase-js');
    const sb = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } },
    );
    const bucket = process.env.SUPABASE_BUCKET || 'contributions';
    const { error } = await sb.storage
      .from(bucket)
      .upload(`pending/${key}`, buffer, { contentType: file.type, upsert: false });
    if (error) throw new Error(error.message);
    const { data } = sb.storage.from(bucket).getPublicUrl(`pending/${key}`);
    return data.publicUrl;
  }

  const dir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, key), buffer);
  return `/uploads/${key}`;
}
