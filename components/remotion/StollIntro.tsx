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
  lede: string;
  beats: [string, string][]; // [value, label] (label may be empty)
  bgSrc?: string;
};

export const STOLL_INTRO_DURATION = 510; // 17s @ 30fps

// The documentary cold-open, serving as the hero: a slow archival establishing
// shot (Ken Burns) graded down to near-black, over which the title resolves
// from heavy blur, the rule draws, the lede settles and the three founding
// beats land in sequence — inside a cinematic letterbox. ARTE / Netflix style.
export const StollIntro: React.FC<StollIntroProps> = ({
  line1,
  line2,
  lede,
  beats,
  bgSrc = '/img/facade-1937.jpg',
}) => {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(0.16, 1, 0.3, 1);
  const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

  const barH = 15;
  const barIn = interpolate(frame, [0, 26], [100, 0], { ...clamp, easing: ease });
  const barOut = interpolate(frame, [482, 510], [0, 100], { ...clamp, easing: ease });
  const barOffset = barIn + barOut;

  // Archival background — slow Ken Burns push + drift, fades up out of black.
  const bgOpacity = interpolate(frame, [0, 80, 460, 505], [0, 0.5, 0.5, 0], clamp);
  const bgScale = interpolate(frame, [0, 510], [1.14, 1.32], clamp);
  const bgX = interpolate(frame, [0, 510], [-2, 2], clamp);
  const bgY = interpolate(frame, [0, 510], [-1.5, 1.5], clamp);

  const glowOpacity = interpolate(frame, [0, 70], [0, 1], clamp);
  const emberOpacity = interpolate(frame, [30, 90, 455, 500], [0, 0.7, 0.7, 0], clamp);

  const push = interpolate(frame, [0, 510], [1, 1.06], clamp);
  const fadeOut = interpolate(frame, [486, 510], [1, 0], clamp);

  // Title.
  const op1 = interpolate(frame, [40, 115], [0, 1], { ...clamp, easing: ease });
  const blur1 = interpolate(frame, [40, 125], [24, 0], { ...clamp, easing: ease });
  const ls1 = interpolate(frame, [40, 135], [28, 4], { ...clamp, easing: ease });
  const op2 = interpolate(frame, [92, 160], [0, 1], { ...clamp, easing: ease });
  const y2 = interpolate(frame, [92, 160], [28, 0], { ...clamp, easing: ease });
  const blur2 = interpolate(frame, [92, 160], [14, 0], { ...clamp, easing: ease });

  // Rule + lede.
  const ruleW = interpolate(frame, [160, 224], [0, 660], { ...clamp, easing: ease });
  const opL = interpolate(frame, [200, 272], [0, 1], { ...clamp, easing: ease });
  const yL = interpolate(frame, [200, 272], [18, 0], { ...clamp, easing: ease });

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
            filter: 'grayscale(0.4) contrast(1.06) brightness(0.8)',
          }}
        />
      </AbsoluteFill>

      {/* Cinematic grade — darken top & bottom, keep the centre readable. */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(5,4,3,.88) 0%, rgba(5,4,3,.54) 40%, rgba(5,4,3,.6) 62%, rgba(5,4,3,.92) 100%)',
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
              fontSize: 98,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: ls1,
              textShadow: '0 6px 30px rgba(0,0,0,.72)',
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
              textShadow: '0 0 48px rgba(201,162,75,.4), 0 4px 24px rgba(0,0,0,.6)',
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
              textShadow: '0 2px 16px rgba(0,0,0,.72)',
            }}
          >
            {lede}
          </div>

          <div style={{ display: 'flex', gap: 60, marginTop: 46, alignItems: 'flex-start' }}>
            {beats.map(([value, label], i) => {
              const start = 300 + i * 26;
              const opB = interpolate(frame, [start, start + 48], [0, 1], {
                ...clamp,
                easing: ease,
              });
              const yB = interpolate(frame, [start, start + 48], [22, 0], {
                ...clamp,
                easing: ease,
              });
              return (
                <div
                  key={i}
                  style={{
                    opacity: opB,
                    transform: `translateY(${yB}px)`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: 132,
                  }}
                >
                  <span style={{ color: COLORS.gold, fontSize: 56, fontWeight: 800, lineHeight: 1 }}>
                    {value}
                  </span>
                  {label ? (
                    <span
                      style={{
                        color: COLORS.boneDim,
                        fontSize: 19,
                        letterSpacing: 3,
                        textTransform: 'uppercase',
                        marginTop: 10,
                      }}
                    >
                      {label}
                    </span>
                  ) : null}
                </div>
              );
            })}
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
