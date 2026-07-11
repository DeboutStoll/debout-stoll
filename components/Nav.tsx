'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import LangSwitch from './LangSwitch';

const SECTION_IDS = [
  'racines',
  'eglise',
  'figures',
  'voix',
  'films',
  'lieux',
  'sources',
  'constat',
  'rejoindre',
] as const;

// Sticky table-of-contents with intelligent active-link highlighting.
export default function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const base = `/${locale}`;

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('nav.toc a[data-section]'),
    );
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = (e.target as HTMLElement).id;
            links.forEach((a) =>
              a.classList.toggle('active', a.dataset.section === id),
            );
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
    return () => spy.disconnect();
  }, []);

  return (
    <nav className="toc">
      <div className="wrap">
        <Link className="brand" href={base}>
          <Image
            className="brand-crest"
            src="/img/crest.png"
            alt=""
            width={20}
            height={22}
            aria-hidden="true"
          />
          {t('brand')}
        </Link>
        <div className="toc-links">
          {SECTION_IDS.map((id) => (
            <a
              key={id}
              href={`${base}#${id}`}
              data-section={id}
              style={id === 'rejoindre' ? { color: 'var(--gold-soft)' } : undefined}
            >
              {t(id)}
            </a>
          ))}
        </div>
        <LangSwitch />
      </div>
    </nav>
  );
}
