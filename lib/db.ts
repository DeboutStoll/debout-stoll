/**
 * Pluggable data layer.
 *
 * • If SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set → uses Supabase
 *   (production: durable, real-time capable, works on serverless).
 * • Otherwise → a local JSON file store under /data (development only:
 *   zero external services, so the app runs and can be tested immediately).
 *
 * The public interface is identical either way, so components and API routes
 * never care which backend is active.
 */
import { promises as fs } from 'fs';
import path from 'path';

export interface Member {
  id: string;
  name: string;
  promotion?: string;
  city?: string;
  email: string;
  message?: string;
  locale: string;
  createdAt: string;
}

export interface Contribution {
  id: string;
  name: string;
  email: string;
  kind: string;
  title: string;
  story: string;
  fileUrl?: string;
  status: 'pending' | 'published' | 'rejected';
  locale: string;
  createdAt: string;
}

// Base member count so the live counter starts from the real network size
// already gathered offline. Override with MEMBER_BASE_COUNT.
export const MEMBER_BASE_COUNT = Number(process.env.MEMBER_BASE_COUNT ?? 0);

const hasSupabase =
  !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

// ---------------------------------------------------------------------------
// Supabase backend (loaded lazily so the dependency stays optional)
// ---------------------------------------------------------------------------
async function supabase() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    { auth: { persistSession: false } },
  );
}

// ---------------------------------------------------------------------------
// Local JSON backend (development fallback)
// ---------------------------------------------------------------------------
const DATA_DIR = path.join(process.cwd(), 'data');

async function readJson<T>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), 'utf8');
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function writeJson<T>(file: string, rows: T[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(rows, null, 2), 'utf8');
}

function id(): string {
  // Timestamp + random suffix — good enough for row ids without extra deps.
  return `${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export async function addMember(
  input: Omit<Member, 'id' | 'createdAt'>,
): Promise<Member> {
  const member: Member = { ...input, id: id(), createdAt: new Date().toISOString() };

  if (hasSupabase) {
    const sb = await supabase();
    const { error } = await sb.from('members').insert({
      name: member.name,
      promotion: member.promotion,
      city: member.city,
      email: member.email,
      message: member.message,
      locale: member.locale,
    });
    if (error) throw new Error(error.message);
    return member;
  }

  const rows = await readJson<Member>('members.json');
  // De-duplicate by email in the dev store.
  if (!rows.some((r) => r.email.toLowerCase() === member.email.toLowerCase())) {
    rows.push(member);
    await writeJson('members.json', rows);
  }
  return member;
}

export async function countMembers(): Promise<number> {
  if (hasSupabase) {
    const sb = await supabase();
    const { count, error } = await sb
      .from('members')
      .select('*', { count: 'exact', head: true });
    if (error) throw new Error(error.message);
    return MEMBER_BASE_COUNT + (count ?? 0);
  }
  const rows = await readJson<Member>('members.json');
  return MEMBER_BASE_COUNT + rows.length;
}

export async function addContribution(
  input: Omit<Contribution, 'id' | 'createdAt' | 'status'>,
): Promise<Contribution> {
  const contribution: Contribution = {
    ...input,
    id: id(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  if (hasSupabase) {
    const sb = await supabase();
    const { error } = await sb.from('contributions').insert({
      name: contribution.name,
      email: contribution.email,
      kind: contribution.kind,
      title: contribution.title,
      story: contribution.story,
      file_url: contribution.fileUrl,
      status: contribution.status,
      locale: contribution.locale,
    });
    if (error) throw new Error(error.message);
    return contribution;
  }

  const rows = await readJson<Contribution>('contributions.json');
  rows.push(contribution);
  await writeJson('contributions.json', rows);
  return contribution;
}

export const backend = hasSupabase ? 'supabase' : 'local-json';
