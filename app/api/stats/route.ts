import { NextResponse } from 'next/server';
import { countMembers } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Live membership counter, polled by the "Rejoindre l'appel" section.
export async function GET() {
  try {
    const count = await countMembers();
    return NextResponse.json(
      { count },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  } catch (err) {
    console.error('[stats] error', err);
    return NextResponse.json({ count: null }, { status: 200 });
  }
}
