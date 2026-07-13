import { NextResponse } from 'next/server';
import { backend } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Liveness/readiness probe for uptime monitors (UptimeRobot, Better Stack…),
// load balancers and the Docker HEALTHCHECK. Cheap and dependency-free: it does
// NOT hit the database, so a DB hiccup never takes the whole site "down" in the
// monitor's eyes — it only reports which backend is wired in.
export async function GET() {
  return NextResponse.json(
    { status: 'ok', backend, time: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
