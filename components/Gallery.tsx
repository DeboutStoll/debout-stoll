import { useTranslations } from 'next-intl';
import GalleryCarousel from './GalleryCarousel';

// Section VII — Lieux: the estate and its stones. Advanced cinematic carousel.
export default function Gallery() {
  const t = useTranslations('lieux');

  return (
    <section id="lieux">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">{t('num')}</span>
        </div>
        <h2 className="sec-title">{t('title')}</h2>
        <p className="sec-intro">{t('intro')}</p>

        <GalleryCarousel />
      </div>
    </section>
  );
}
