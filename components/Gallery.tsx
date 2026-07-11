import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n-config';
import { gallery } from '@/content/gallery';
import { t as tr } from '@/content/types';
import { Html } from './Html';
import LightboxImage from './LightboxImage';

// Section VI — Lieux: the estate and its stones. Masonry gallery.
export default function Gallery() {
  const locale = useLocale() as Locale;
  const t = useTranslations('lieux');

  return (
    <section id="lieux">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">{t('num')}</span>
        </div>
        <h2 className="sec-title">{t('title')}</h2>
        <p className="sec-intro">{t('intro')}</p>

        <div className="gallery">
          {gallery.map((g) => (
            <figure key={g.id}>
              <LightboxImage
                src={g.image}
                alt={tr(g.alt, locale)}
                width={640}
                height={480}
                sizes="(max-width: 520px) 100vw, (max-width: 860px) 50vw, 33vw"
                caption={tr(g.caption, locale)}
                style={{ height: 'auto' }}
              />
              <Html as="figcaption" html={tr(g.caption, locale)} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
