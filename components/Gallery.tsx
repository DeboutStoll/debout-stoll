import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n-config';
import { gallery } from '@/content/gallery';
import { t as tr } from '@/content/types';
import ImageCarousel, { type CarouselImage } from './ImageCarousel';

// Section VII — Lieux: the estate and its stones. Advanced cinematic carousel.
export default function Gallery() {
  const locale = useLocale() as Locale;
  const t = useTranslations('lieux');

  const items: CarouselImage[] = gallery.map((g) => ({
    id: g.id,
    src: g.image,
    alt: tr(g.alt, locale),
    caption: tr(g.caption, locale),
  }));

  return (
    <section id="lieux">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">{t('num')}</span>
        </div>
        <h2 className="sec-title">{t('title')}</h2>
        <p className="sec-intro">{t('intro')}</p>

        <ImageCarousel items={items} ariaLabel={t('title')} aspect="16 / 9" fit="cover" />
      </div>
    </section>
  );
}
