'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Data-light mode for slow / metered connections (Cameroon).
 * Sets <html data-datalight="true">, which the CSS uses to drop the heavy
 * decorative layers (grain, Ken Burns, intro). Choice persists in localStorage.
 */
export default function DataLightToggle() {
  const t = useTranslations('common');
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(document.documentElement.dataset.datalight === 'true');
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    document.documentElement.dataset.datalight = next ? 'true' : 'false';
    try {
      localStorage.setItem('datalight', next ? 'true' : 'false');
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      className="dl-toggle"
      onClick={toggle}
      aria-pressed={on}
      title={t('dataLightLabel')}
    >
      <span className="dot" aria-hidden="true" />
      {t('dataLightLabel')}
    </button>
  );
}
