'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

// Four historical moments retraced by the background slideshow.
const SLIDES = [
  { img: '/img/chantier-1923.jpg', year: { fr: '1923', en: '1923' }, label: { fr: 'Le chantier', en: 'The construction' } },
  { img: '/img/facade-1937.jpg', year: { fr: '1937', en: '1937' }, label: { fr: 'La façade', en: 'The façade' } },
  { img: '/img/inauguration-1969.jpg', year: { fr: '1969', en: '1969' }, label: { fr: "L'inauguration", en: 'The inauguration' } },
  { img: '/img/14-hectares.jpg', year: { fr: "Aujourd'hui", en: 'Today' }, label: { fr: '14 hectares', en: '14 hectares' } },
];

// The documentary cold-open, serving as the hero. A fully responsive CSS/React
// slideshow (Ken Burns cross-fade of four historical moments) fills the whole
// band on every device, with responsive `clamp()` typography over it — ARTE /
// Netflix style, crisp from small phones to desktop.
export default function FilmIntro() {
  const t = useTranslations('hero');
  const loc = (useLocale() === 'en' ? 'en' : 'fr') as 'fr' | 'en';
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setActive((a) => (a + 1) % SLIDES.length),
      7000,
    );
    return () => window.clearInterval(id);
  }, []);

  const cur = SLIDES[active];

  return (
    <header className="hero-film" role="img" aria-label={`${t('title')} ${t('titleEm')}`}>
      <div className="hf-slides" aria-hidden="true">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`hf-slide${i === active ? ' is-active' : ''}`}
            style={{ backgroundImage: `url(${s.img})` }}
          />
        ))}
      </div>
      <div className="hf-grade" aria-hidden="true" />
      <div className="hf-bar hf-bar-top" aria-hidden="true" />
      <div className="hf-bar hf-bar-bottom" aria-hidden="true" />

      <div className="hf-content">
        <h1 className="hf-title">
          {t('title')}
          <br />
          <em>{t('titleEm')}</em>
        </h1>
        <span className="hf-rule" aria-hidden="true" />
        <p className="hf-lede">{t('lede')}</p>
      </div>

      <div className="hf-caption" aria-hidden="true">
        <b key={active}>{cur.year[loc]}</b>
        <span>{cur.label[loc]}</span>
      </div>

      <div className="hf-scroll" aria-hidden="true">
        <span>{loc === 'en' ? 'Scroll' : 'Défiler'}</span>
        <span className="line" />
      </div>
    </header>
  );
}
