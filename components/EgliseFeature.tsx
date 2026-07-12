import { useMessages, useTranslations } from 'next-intl';
import { RichText } from './RichText';
import LightboxImage from './LightboxImage';
import ImageCarousel, { type CarouselImage } from './ImageCarousel';

// Section II — L'église: the jewel that gave the place its soul.
export default function EgliseFeature() {
  const t = useTranslations('eglise');
  const messages = useMessages() as { eglise: Record<string, string> };

  // The archive photographs, as a carousel. The two feature frames below
  // (façade today, 23 Feb 1969 inauguration) stay in place.
  const archive: CarouselImage[] = [
    { id: 'strip1', src: '/img/stoll-chantier.jpg', alt: "Le Père Stoll sur le chantier de l'église", caption: messages.eglise.strip1 },
    { id: 'strip2', src: '/img/allee-fete.jpg', alt: "Fidèles entrant dans l'église lors d'une fête", caption: messages.eglise.strip2 },
    { id: 'strip3', src: '/img/facade-1937.jpg', alt: "Façade de l'église lors d'une fête 1937", caption: messages.eglise.strip3 },
  ];

  return (
    <section id="eglise">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">{t('num')}</span>
        </div>
        <h2 className="sec-title">{t('title')}</h2>

        <div className="feature">
          <div className="txt">
            <h3>{t('f1title')}</h3>
            <RichText as="p" path="eglise.f1p1" />
            <RichText as="p" path="eglise.f1p2" />
            <RichText as="p" path="eglise.f1p3" />
          </div>
          <figure className="frame">
            <LightboxImage
              src="/img/eglise-aujourdhui.jpg"
              alt="Église Notre-Dame des Sept Douleurs, Akono, aujourd'hui"
              width={900}
              height={600}
              sizes="(max-width: 860px) 100vw, 50vw"
              caption={messages.eglise.f1cap}
            />
            <RichText as="figcaption" path="eglise.f1cap" />
          </figure>
        </div>

        <div style={{ marginTop: 40 }}>
          <ImageCarousel items={archive} ariaLabel={t('title')} aspect="3 / 2" fit="contain" />
        </div>

        <div className="feature rev" style={{ marginTop: 52 }}>
          <figure className="frame frame-feature">
            <LightboxImage
              src="/img/inauguration-1969.jpg"
              alt="Inauguration du Collège Stoll, 23 février 1969, Paul Biya ancien séminariste d'Akono"
              width={1100}
              height={733}
              sizes="(max-width: 860px) 100vw, 50vw"
              caption={messages.eglise.f2cap}
              priority
            />
            <RichText as="figcaption" path="eglise.f2cap" />
          </figure>
          <div className="txt">
            <h3>{t('f2title')}</h3>
            <RichText as="p" path="eglise.f2p1" />
            <RichText as="p" path="eglise.f2p2" />
            <RichText as="p" path="eglise.f2p3" />
          </div>
        </div>
      </div>
    </section>
  );
}
