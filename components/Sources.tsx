import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n-config';
import { sources } from '@/content/sources';
import { t as tr } from '@/content/types';
import { Html } from './Html';

// Section VII — Sources.
export default function Sources() {
  const locale = useLocale() as Locale;
  const t = useTranslations('sources');

  return (
    <section id="sources">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">{t('num')}</span>
        </div>
        <h2 className="sec-title">{t('title')}</h2>
        <p className="sec-intro">{t('intro')}</p>

        <div className="sources">
          {sources.map((s) => (
            <div className="source" key={s.id}>
              <h5>{tr(s.title, locale)}</h5>
              {s.href ? (
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  <Html as="p" html={tr(s.body, locale)} />
                </a>
              ) : (
                <Html as="p" html={tr(s.body, locale)} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
