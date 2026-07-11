import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n-config';
import { quotes, anecdotes } from '@/content/quotes';
import { t as tr } from '@/content/types';
import { Html } from './Html';

// Section IV — La voix: founding quotes, anecdotes and the SOS block.
export default function Voix() {
  const locale = useLocale() as Locale;
  const t = useTranslations('voix');

  return (
    <section id="voix">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">{t('num')}</span>
        </div>
        <h2 className="sec-title">{t('title')}</h2>
        <p className="sec-intro">{t('intro')}</p>

        {quotes.map((q) => (
          <figure className="quote" data-reveal key={q.id}>
            <Html as="p" html={tr(q.text, locale)} />
            <cite>{tr(q.cite, locale)}</cite>
          </figure>
        ))}

        <div className="anecdotes">
          {anecdotes.map((a) => (
            <div className="anec" key={a.id}>
              <h4>{tr(a.title, locale)}</h4>
              <p>{tr(a.body, locale)}</p>
            </div>
          ))}
        </div>

        <div className="sos">
          <p className="eyebrow">{t('sosEyebrow')}</p>
          <p className="big">
            <b>{t('sosBig')}</b>
          </p>
          <p>{t('sosP')}</p>
          <p style={{ marginTop: 16, color: 'var(--gold-soft)', fontStyle: 'italic' }}>
            {t('sosClose')}
          </p>
        </div>
      </div>
    </section>
  );
}
