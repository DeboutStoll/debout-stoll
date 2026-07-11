'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

// Live membership counter — polls /api/stats so the figure updates in
// near-real-time as new members join, without a full page reload.
export default function StatsCounter() {
  const t = useTranslations('rejoindre');
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch('/api/stats', { cache: 'no-store' });
        const data = (await res.json()) as { count: number | null };
        if (alive && typeof data.count === 'number') setCount(data.count);
      } catch {
        /* keep last known value */
      }
    };
    load();
    const id = window.setInterval(load, 15_000);
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
