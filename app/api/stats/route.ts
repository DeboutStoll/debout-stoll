import { NextResponse } from 'next/server';
import { countMembers } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Live membership counter, polled by the "Rejoindre l'appel" section.
// Cached at the CDN edge for a few seconds so a spike of visitors worldwide
// collapses into roughly one DB read per region per interval, instead of one
// per poll. A counter that is a few seconds stale is perfectly acceptable.
export async function GET() {
  try {
    const count = await countMembers();
    return NextResponse.json(
      { count },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        },
      },
    );
  } catch (err) {
    console.error('[stats] error', err);
    // Never cache an error response — let the next poll retry against origin.
    return NextResponse.json(
      { count: null },
      { status: 200, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
