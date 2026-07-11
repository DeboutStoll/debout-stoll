'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales, localeLabels, localeNames, isLocale } from '@/lib/i18n-config';

// FR | EN switch that keeps the current path and swaps only the locale segment.
export default function LangSwitch() {
  const pathname = usePathname() || '/';
  const active = useLocale();

  const swap = (target: string) => {
    const segments = pathname.split('/');
    // segments[0] === '' (leading slash); segments[1] is the locale.
    if (segments[1] && isLocale(segments[1])) {
      segments[1] = target;
    } else {
      segments.splice(1, 0, target);
    }
    return segments.join('/') || `/${target}`;
  };

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {locales.map((loc) => (
        <Link
          key={loc}
          href={swap(loc)}
          className={loc === active ? 'active' : ''}
          hrefLang={loc}
          aria-current={loc === active ? 'true' : undefined}
          aria-label={localeNames[loc]}
          prefetch={false}
        >
          {localeLabels[loc]}
        </Link>
      ))}
    </div>
  );
}
