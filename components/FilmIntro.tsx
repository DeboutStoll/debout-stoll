'use client';

import dynamic from 'next/dynamic';
import { useLocale, useTranslations } from 'next-intl';
import { StollIntro, STOLL_INTRO_DURATION } from './remotion/StollIntro';

const Player = dynamic(() => import('@remotion/player').then((m) => m.Player), {
  ssr: false,
  loading: () => <div className="film-intro-loading" aria-hidden="true" />,
});

// The opening title sequence, now serving as the hero itself: a full-bleed,
// full-viewport cinematic band (ARTE / Netflix style). The 16:9 composition is
// scaled to COVER the whole band; a scroll cue invites the reader downward.
export default function FilmIntro() {
  const t = useTranslations('hero');
  const en = useLocale() === 'en';

  // Four historical moments retraced by the background slideshow.
  const slides = [
    { img: '/img/chantier-1923.jpg', year: '1923', label: en ? 'The construction' : 'Le chantier' },
    { img: '/img/facade-1937.jpg', year: '1937', label: en ? 'The façade' : 'La façade' },
    { img: '/img/inauguration-1969.jpg', year: '1969', label: en ? 'The inauguration' : "L'inauguration" },
    { img: '/img/14-hectares.jpg', year: en ? 'Today' : "Aujourd'hui", label: en ? '14 hectares' : '14 hectares' },
  ];

  return (
    <header
      className="film-intro"
      role="img"
      aria-label={`${t('title')} ${t('titleEm')}`}
    >
      <div className="film-intro-inner">
        <Player
          component={StollIntro}
          durationInFrames={STOLL_INTRO_DURATION}
          fps={30}
          compositionWidth={1920}
          compositionHeight={1080}
          // Cover the full viewport band without distortion (the 16:9 box is
          // grown to the larger of width/height and centred; overflow clipped).
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'max(100vw, 177.78svh)',
            height: 'max(100svh, 56.25vw)',
          }}
          autoPlay
          loop
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          initiallyMuted
          inputProps={{
            line1: t('title'),
            line2: t('titleEm'),
            lede: t('lede'),
            slides,
          }}
        />
      </div>
      <div className="film-scroll" aria-hidden="true">
        <span>{en ? 'Scroll' : 'Défiler'}</span>
        <span className="line" />
      </div>
    </header>
  );
}
