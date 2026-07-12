import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n-config';
import { quotes, anecdotes } from '@/content/quotes';
import { t as tr } from '@/content/types';
import { Html } from './Html';
import CardCarousel from './CardCarousel';

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

        <CardCarousel
          ariaLabel={locale === 'en' ? 'Anecdotes' : 'Anecdotes'}
          variant="cardcar-anecdote"
          autoplayMs={8000}
          slides={anecdotes.map((a, i) => ({
            id: a.id,
            node: (
              <div className="anec-card">
                <span className="anec-card-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="anec-card-kicker">
                  {locale === 'en' ? 'A story' : 'Un récit'}
                </span>
                <h4>{tr(a.title, locale)}</h4>
                <p>{tr(a.body, locale)}</p>
              </div>
            ),
          }))}
        />
      </div>
    </section>
  );
}
