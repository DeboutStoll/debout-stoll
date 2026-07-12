'use client';

import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';
import { AkonoTitle, AKONO_DURATION } from './remotion/AkonoTitle';

const Player = dynamic(() => import('@remotion/player').then((m) => m.Player), {
  ssr: false,
  loading: () => <div className="film-intro-loading" aria-hidden="true" />,
});

// The documentary's opening titles — a seamless, controls-free cold-open
// (ARTE / Netflix documentary style): autoplays, loops, no chrome, the story
// begins immediately below.
export default function FilmIntro() {
  const locale = useLocale();
  const en = locale === 'en';

  return (
    <div className="film-intro" role="img" aria-label={en ? 'Opening titles — AKONO' : "Générique d'ouverture — AKONO"}>
      <div className="film-intro-inner">
        <Player
          component={AkonoTitle}
          durationInFrames={AKONO_DURATION}
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
            presents: en ? 'The alumni network presents' : 'Le réseau des anciens présente',
            tagline: en ? 'Seminary · Mission · College' : 'Séminaire · Mission · Collège',
          }}
        />
      </div>
    </div>
  );
}
