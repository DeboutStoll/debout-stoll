import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n-config';
import { timeline } from '@/content/timeline';
import { t as tr } from '@/content/types';
import { RichText } from './RichText';

// Section I — Racines: animated timeline 1919 → 2018.
export default function Timeline() {
  const locale = useLocale() as Locale;
  const t = useTranslations('racines');

  return (
    <section id="racines">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">{t('num')}</span>
        </div>
        <h2 className="sec-title">{t('title')}</h2>
        <RichText as="p" className="sec-intro" path="racines.intro" />

        <div className="timeline">
          {timeline.map((item) => (
            <div className="tl-item" key={item.id}>
              <div className="tl-dot" />
              <div className="tl-year">{tr(item.year, locale)}</div>
              <h4>{tr(item.title, locale)}</h4>
              <p>{tr(item.body, locale)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
