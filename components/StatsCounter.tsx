'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

// Live membership counter for the static site.
//
// There is no app server, so the browser reads the count straight from Supabase
// via a public RPC (`member_count`) using the anon key — both values are safe to
// expose and are injected at build time:
//   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
// A base offset (members gathered offline) can be added with
//   NEXT_PUBLIC_MEMBER_BASE_COUNT
// If Supabase isn't configured, the counter shows the base offset as a static
// figure instead of a broken "—".
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BASE = Number(process.env.NEXT_PUBLIC_MEMBER_BASE_COUNT ?? 0) || 0;

export default function StatsCounter() {
  const t = useTranslations('rejoindre');
  const [count, setCount] = useState<number | null>(BASE > 0 ? BASE : null);

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON) return; // static fallback (BASE)
    let alive = true;

    const load = async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/member_count`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            apikey: SUPABASE_ANON,
            authorization: `Bearer ${SUPABASE_ANON}`,
          },
          body: '{}',
        });
        const value = await res.json();
        if (alive && typeof value === 'number') setCount(BASE + value);
      } catch {
        /* keep last known / base value */
      }
    };

    load();
    const id = window.setInterval(load, 30_000);
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => {
      alive = false;
      window.clearInterval(id);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  return (
    <div className="join-stats">
      <div className="jstat">
        <b>1&nbsp;500</b>
        <small>{t('statToday2004')}</small>
      </div>
      <div className="jstat">
        <b>&lt;&nbsp;200</b>
        <small>{t('statTodayNow')}</small>
      </div>
      <div className="jstat live">
        <b>{count === null ? '—' : count.toLocaleString('fr-FR')}</b>
        <small>{t('statMembers')}</small>
      </div>
    </div>
  );
}
