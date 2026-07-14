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

export type Slide = { img: string; year: string; label: string };

export type StollIntroProps = {
  line1: string; // "Une même colline,"
  line2: string; // "trois âges d'une œuvre"
  lede: string;
  slides: Slide[]; // four historical moments, cross-faded in the background
};

export const STOLL_INTRO_DURATION = 840; // 28s @ 30fps (~7s per slide)

// The documentary cold-open, serving as the hero. A cross-fading Ken Burns
// slideshow of four historical moments (1923 → 1937 → 1969 → today) runs full
// bleed behind the title, each slide marked by a lower-third year caption —
// ARTE / Netflix style, inside a cinematic letterbox.
export const StollIntro: React.FC<StollIntroProps> = ({
  line1,
  line2,
  lede,
  slides,
}) => {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(0.16, 1, 0.3, 1);
  const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

  const D = STOLL_INTRO_DURATION;
  const N = Math.max(slides.length, 1);
  const seg = D / N; // frames per slide

  // Per-slide cross-fade envelope + slow Ken Burns.
  const slideState = (i: number) => {
    const s = i * seg;
    const e = s + seg;
    const fin: [number, number] = i === 0 ? [0, 55] : [s - 30, s + 30];
    const a = interpolate(frame, fin, [0, 1], clamp);
    const b =
      i === N - 1 ? 1 : interpolate(frame, [e - 30, e + 30], [1, 0], clamp);
    const opacity = a * b;
    const scale = interpolate(frame, [s - 30, e + 30], [1.12, 1.3], clamp);
    const tx = interpolate(frame, [s - 30, e + 30], [-2.2, 2.2], clamp);
    const ty = interpolate(frame, [s - 30, e + 30], [-1.4, 1.4], clamp);
    return { opacity, scale, tx, ty };
  };

  const barH = 15;
  const barIn = interpolate(frame, [0, 26], [100, 0], { ...clamp, easing: ease });
  const barOut = interpolate(frame, [D - 28, D], [0, 100], { ...clamp, easing: ease });
  const barOffset = barIn + barOut;

  const glowOpacity = interpolate(frame, [0, 70], [0, 1], clamp);
  const emberOpacity = interpolate(frame, [30, 90, D - 55, D - 12], [0, 0.6, 0.6, 0], clamp);
  const fadeOut = interpolate(frame, [D - 28, D], [1, 0], clamp);

  // Title (persistent hero text) resolves once at the top.
  const op1 = interpolate(frame, [40, 115], [0, 1], { ...clamp, easing: ease });
  const blur1 = interpolate(frame, [40, 125], [24, 0], { ...clamp, easing: ease });
  const ls1 = interpolate(frame, [40, 135], [28, 4], { ...clamp, easing: ease });
  const op2 = interpolate(frame, [92, 160], [0, 1], { ...clamp, easing: ease });
  const y2 = interpolate(frame, [92, 160], [28, 0], { ...clamp, easing: ease });
  const blur2 = interpolate(frame, [92, 160], [14, 0], { ...clamp, easing: ease });
  const ruleW = interpolate(frame, [160, 224], [0, 660], { ...clamp, easing: ease });
  const opL = interpolate(frame, [200, 272], [0, 1], { ...clamp, easing: ease });
  const yL = interpolate(frame, [200, 272], [18, 0], { ...clamp, easing: ease });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper, fontFamily: SERIF }}>
      {/* Background slideshow — four historical moments, cross-faded */}
      {slides.map((sl, i) => {
        const st = slideState(i);
        return (
          <AbsoluteFill key={i} style={{ opacity: st.opacity }}>
            <Img
              src={sl.img}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${st.scale}) translate(${st.tx}%, ${st.ty}%)`,
                filter: 'grayscale(0.5) contrast(1.1) brightness(0.6)',
              }}
            />
          </AbsoluteFill>
        );
      })}

      {/* Cinematic grade */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(5,4,3,.94) 0%, rgba(5,4,3,.72) 40%, rgba(5,4,3,.76) 62%, rgba(5,4,3,.97) 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: glowOpacity,
          background:
            'radial-gradient(1100px 720px at 50% 46%, rgba(176,85,47,.18), transparent 62%)',
        }}
      />
      <Embers count={24} opacity={emberOpacity} />

      {/* Title + lede (persistent) */}
      <AbsoluteFill style={{ opacity: fadeOut }}>
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '0 7%',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              opacity: op1,
              filter: `blur(${blur1}px)`,
              color: COLORS.bone,
              fontSize: 98,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: ls1,
              textShadow: '0 6px 30px rgba(0,0,0,.75)',
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
              fontSize: 80,
              fontWeight: 700,
              lineHeight: 1.08,
              marginTop: 6,
              textShadow: '0 0 48px rgba(201,162,75,.4), 0 4px 24px rgba(0,0,0,.65)',
            }}
          >
            {line2}
          </div>
          <div
            style={{
              height: 2,
              width: ruleW,
              marginTop: 36,
              background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            }}
          />
          <div
            style={{
              opacity: opL,
              transform: `translateY(${yL}px)`,
              color: COLORS.bone,
              fontStyle: 'italic',
              fontSize: 31,
              lineHeight: 1.5,
              maxWidth: 1160,
              marginTop: 28,
              textShadow: '0 2px 16px rgba(0,0,0,.75)',
            }}
          >
            {lede}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Lower-third year caption per slide */}
      {slides.map((sl, i) => {
        const st = slideState(i);
        return (
          <div
            key={`cap-${i}`}
            style={{
              position: 'absolute',
              left: '6%',
              bottom: '18%',
              opacity: st.opacity * fadeOut,
              display: 'flex',
              alignItems: 'baseline',
              gap: 18,
              zIndex: 3,
            }}
          >
            <span
              style={{
                color: COLORS.gold,
                fontSize: 46,
                fontWeight: 800,
                textShadow: '0 2px 18px rgba(0,0,0,.8)',
              }}
            >
              {sl.year}
            </span>
            <span
              style={{
                color: COLORS.boneDim,
                fontSize: 22,
                letterSpacing: 4,
                textTransform: 'uppercase',
                textShadow: '0 2px 14px rgba(0,0,0,.8)',
              }}
            >
              {sl.label}
            </span>
          </div>
        );
      })}

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
