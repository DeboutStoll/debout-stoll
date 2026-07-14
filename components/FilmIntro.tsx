'use client';

import dynamic from 'next/dynamic';
import { useLocale, useTranslations } from 'next-intl';
import { StollIntro, STOLL_INTRO_DURATION } from './remotion/StollIntro';

const Player = dynamic(() => import('@remotion/player').then((m) => m.Player), {
  ssr: false,
  loading: () => <div className="film-intro-loading" aria-hidden="true" />,
});

// The documentary's opening titles — a seamless, controls-free cold-open
// (ARTE / Netflix documentary style): the "Une même colline…" title sequence
// resolves cinematically, then the story begins immediately below. No logo.
export default function FilmIntro() {
  const t = useTranslations('hero');
  const en = useLocale() === 'en';

  const beats: [string, string][] = [
    [t('stat1v'), t('stat1l')],
    [t('stat2v'), t('stat2l')],
    [t('stat3v'), t('stat3l')],
  ];

  return (
    <div
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
          style={{ width: '100%', height: '100%' }}
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
            beats,
          }}
        />
      </div>
    </div>
  );
}
