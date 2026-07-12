import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n-config';
import { figures } from '@/content/figures';
import { t as tr } from '@/content/types';
import { RichText } from './RichText';
import ImageCarousel, { type CarouselImage } from './ImageCarousel';

// Section III — Figures: the pantheon, as a cinematic carousel of portraits.
export default function Pantheon() {
  const locale = useLocale() as Locale;
  const t = useTranslations('figures');

  const items: CarouselImage[] = figures
    .filter((f) => f.image)
    .map((f) => ({
      id: f.id,
      src: f.image as string,
      alt: tr(f.imageAlt, locale),
      caption:
        `<b>${f.name}</b> · ${tr(f.role, locale)}<br>` +
        `<span style="color:var(--gold-soft);font-style:italic">${tr(f.dates, locale)}</span> — ${tr(f.bio, locale)}`,
    }));

  return (
    <section id="figures">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">{t('num')}</span>
        </div>
        <h2 className="sec-title">{t('title')}</h2>
        <RichText as="p" className="sec-intro" path="figures.intro" />

        <ImageCarousel
          items={items}
          ariaLabel={t('title')}
          aspect="3 / 2"
          fit="contain"
        />
      </div>
    </section>
  );
}
