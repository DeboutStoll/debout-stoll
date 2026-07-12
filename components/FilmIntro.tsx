'use client';

import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';
import { AkonoTitle, AKONO_DURATION } from './remotion/AkonoTitle';

// Player is browser-only.
const Player = dynamic(() => import('@remotion/player').then((m) => m.Player), {
  ssr: false,
  loading: () => <div className="film-intro-loading" aria-hidden="true" />,
});

// The film's opening titles, embedded live at the top of the site via
// @remotion/player — autoplaying, looping, prominent (ARTE / Netflix / Prime).
export default function FilmIntro() {
  const locale = useLocale();
  const en = locale === 'en';

  return (
    <div className="film-intro" role="region" aria-label={en ? 'Opening titles' : "Générique d'ouverture"}>
      <div className="film-intro-inner">
        <Player
          component={AkonoTitle}
          durationInFrames={AKONO_DURATION}
          fps={30}
          compositionWidth={1920}
          compositionHeight={1080}
          style={{ width: '100%', height: '100%' }}
          controls
          autoPlay
          loop
          clickToPlay
          doubleClickToFullscreen
          inputProps={{
            presents: en ? 'The alumni network presents' : 'Le réseau des anciens présente',
            tagline: en ? 'Seminary · Mission · College' : 'Séminaire · Mission · Collège',
          }}
        />
      </div>
      <a className="film-intro-cue" href="#racines">
        {en ? 'The film begins' : 'Le film commence'} ▾
      </a>
    </div>
  );
}
