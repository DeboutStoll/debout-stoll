import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import { COLORS, SERIF } from './theme';
import { Embers, FilmGrain, Vignette } from './Layers';

export type StollIntroProps = {
  line1: string; // "Une même colline,"
  line2: string; // "trois âges d'une œuvre"
  tagline: string; // "Un patrimoine en péril"
  bgSrc?: string;
};

export const STOLL_INTRO_DURATION = 450; // 15s @ 30fps

// The documentary cold-open, serving as the hero: a slow archival establishing
// shot (Ken Burns) graded down to near-black, over which the title resolves
// from heavy blur behind a cinematic letterbox — ARTE / Netflix style. Minimal
// text: the title and a single tagline line.
export const StollIntro: React.FC<StollIntroProps> = ({
  line1,
  line2,
  tagline,
  bgSrc = '/img/vue-aerienne.jpg',
}) => {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(0.16, 1, 0.3, 1);
  const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

  // Letterbox bars close in, part at the end.
  const barH = 15;
  const barIn = interpolate(frame, [0, 26], [100, 0], { ...clamp, easing: ease });
  const barOut = interpolate(frame, [422, 450], [0, 100], { ...clamp, easing: ease });
  const barOffset = barIn + barOut;

  // Archival background — slow Ken Burns push + drift, fades up out of black.
  const bgOpacity = interpolate(frame, [0, 80, 400, 445], [0, 0.5, 0.5, 0], clamp);
  const bgScale = interpolate(frame, [0, 450], [1.14, 1.3], clamp);
  const bgX = interpolate(frame, [0, 450], [-2, 2], clamp);
  const bgY = interpolate(frame, [0, 450], [-1.5, 1.5], clamp);

  const glowOpacity = interpolate(frame, [0, 70], [0, 1], clamp);
  const emberOpacity = interpolate(frame, [30, 90, 400, 440], [0, 0.7, 0.7, 0], clamp);

  const push = interpolate(frame, [0, 450], [1, 1.06], clamp);
  const fadeOut = interpolate(frame, [426, 450], [1, 0], clamp);

  // Title line 1 — resolves from heavy blur, letterspacing tightening.
  const op1 = interpolate(frame, [40, 112], [0, 1], { ...clamp, easing: ease });
  const blur1 = interpolate(frame, [40, 122], [24, 0], { ...clamp, easing: ease });
  const ls1 = interpolate(frame, [40, 132], [28, 4], { ...clamp, easing: ease });

  // Title line 2 (italic gold) — rises and sharpens just after.
  const op2 = interpolate(frame, [90, 156], [0, 1], { ...clamp, easing: ease });
  const y2 = interpolate(frame, [90, 156], [28, 0], { ...clamp, easing: ease });
  const blur2 = interpolate(frame, [90, 156], [14, 0], { ...clamp, easing: ease });

  // Rule + tagline.
  const ruleW = interpolate(frame, [156, 216], [0, 620], { ...clamp, easing: ease });
  const opT = interpolate(frame, [200, 262], [0, 1], { ...clamp, easing: ease });
  const yT = interpolate(frame, [200, 262], [16, 0], { ...clamp, easing: ease });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper, fontFamily: SERIF }}>
      {/* Archival establishing shot (Ken Burns) */}
      <AbsoluteFill style={{ opacity: bgOpacity }}>
        <Img
          src={bgSrc}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${bgScale}) translate(${bgX}%, ${bgY}%)`,
            filter: 'grayscale(0.35) contrast(1.05) brightness(0.82)',
          }}
        />
      </AbsoluteFill>

      {/* Cinematic grade — darken top & bottom, keep the centre readable. */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(5,4,3,.86) 0%, rgba(5,4,3,.5) 42%, rgba(5,4,3,.5) 58%, rgba(5,4,3,.9) 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: glowOpacity,
          background:
            'radial-gradient(1100px 720px at 50% 46%, rgba(176,85,47,.2), transparent 62%)',
        }}
      />
      <Embers count={26} opacity={emberOpacity} />

      <AbsoluteFill style={{ opacity: fadeOut }}>
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '0 7%',
            textAlign: 'center',
            transform: `scale(${push})`,
          }}
        >
          <div
            style={{
              opacity: op1,
              filter: `blur(${blur1}px)`,
              color: COLORS.bone,
              fontSize: 100,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: ls1,
              textShadow: '0 6px 30px rgba(0,0,0,.7)',
            }}
          >
            {line1}
          </div>
          <div
            style={{
              opacity: op2,
              filter: `blur(${blur2}px)`,
              transform: `translateY(${y2}px)`,
              color: COLORS.goldSoft,
              fontStyle: 'italic',
              fontSize: 82,
              fontWeight: 700,
              lineHeight: 1.08,
              marginTop: 6,
              textShadow: '0 0 48px rgba(201,162,75,.4), 0 4px 24px rgba(0,0,0,.6)',
            }}
          >
            {line2}
          </div>

          <div
            style={{
              height: 2,
              width: ruleW,
              marginTop: 40,
              background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            }}
          />

          <div
            style={{
              opacity: opT,
              transform: `translateY(${yT}px)`,
              color: COLORS.goldSoft,
              fontSize: 27,
              fontWeight: 600,
              letterSpacing: 10,
              textTransform: 'uppercase',
              marginTop: 30,
              textShadow: '0 2px 18px rgba(0,0,0,.7)',
            }}
          >
            {tagline}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      <FilmGrain />
      <Vignette />

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: `${barH}%`,
          background: '#000',
          transform: `translateY(-${barOffset}%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${barH}%`,
          background: '#000',
          transform: `translateY(${barOffset}%)`,
        }}
      />
    </AbsoluteFill>
  );
};
