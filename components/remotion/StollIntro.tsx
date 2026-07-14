import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import { COLORS, SERIF } from './theme';
import { Embers, FilmGrain, Vignette } from './Layers';

export type StollIntroProps = {
  line1: string; // "Une même colline,"
  line2: string; // "trois âges d'une œuvre"
  lede: string;
  beats: [string, string][]; // [value, label]
};

export const STOLL_INTRO_DURATION = 450; // 15s @ 30fps

// The documentary cold-open (ARTE / Netflix style): black → embers, the title
// resolves from heavy blur behind a slow camera push, the rule draws, the lede
// settles, then the three founding beats land in sequence — all inside a
// cinematic letterbox. No logo, no call to action: pure title sequence.
export const StollIntro: React.FC<StollIntroProps> = ({
  line1,
  line2,
  lede,
  beats,
}) => {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(0.16, 1, 0.3, 1);
  const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

  // Letterbox bars close in, part at the end.
  const barH = 15;
  const barIn = interpolate(frame, [0, 26], [100, 0], { ...clamp, easing: ease });
  const barOut = interpolate(frame, [422, 450], [0, 100], { ...clamp, easing: ease });
  const barOffset = barIn + barOut;

  // Ambient ember glow out of black.
  const glowOpacity = interpolate(frame, [0, 70], [0, 1], clamp);
  const emberOpacity = interpolate(frame, [30, 90, 410, 445], [0, 1, 1, 0], clamp);

  // Slow cinematic camera push + breathing tilt.
  const push = interpolate(frame, [0, 450], [1, 1.09], clamp);
  const sceneRotX = interpolate(frame, [0, 450], [4, -3], clamp);
  const sceneRotY = Math.sin(frame / 80) * 2;
  const fadeOut = interpolate(frame, [426, 450], [1, 0], clamp);

  // Title line 1 — resolves from heavy blur, letterspacing tightening.
  const op1 = interpolate(frame, [40, 110], [0, 1], { ...clamp, easing: ease });
  const blur1 = interpolate(frame, [40, 120], [22, 0], { ...clamp, easing: ease });
  const ls1 = interpolate(frame, [40, 130], [26, 4], { ...clamp, easing: ease });
  const z1 = interpolate(frame, [40, 120], [-180, 0], { ...clamp, easing: ease });

  // Title line 2 (italic gold) — rises and sharpens just after.
  const op2 = interpolate(frame, [88, 152], [0, 1], { ...clamp, easing: ease });
  const y2 = interpolate(frame, [88, 152], [26, 0], { ...clamp, easing: ease });
  const blur2 = interpolate(frame, [88, 152], [14, 0], { ...clamp, easing: ease });

  // Rule + lede.
  const ruleW = interpolate(frame, [150, 210], [0, 680], { ...clamp, easing: ease });
  const opL = interpolate(frame, [170, 240], [0, 1], { ...clamp, easing: ease });
  const yL = interpolate(frame, [170, 240], [18, 0], { ...clamp, easing: ease });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper, fontFamily: SERIF }}>
      <AbsoluteFill
        style={{
          opacity: glowOpacity,
          background:
            'radial-gradient(1100px 720px at 50% 44%, rgba(176,85,47,.22), transparent 62%)',
        }}
      />
      <Embers count={28} opacity={emberOpacity} />

      <AbsoluteFill
        style={{ opacity: fadeOut, perspective: 1700, perspectiveOrigin: '50% 44%' }}
      >
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '0 7%',
            textAlign: 'center',
            transformStyle: 'preserve-3d',
            transform: `scale(${push}) rotateX(${sceneRotX}deg) rotateY(${sceneRotY}deg)`,
          }}
        >
          {/* Title */}
          <div
            style={{
              opacity: op1,
              filter: `blur(${blur1}px)`,
              transform: `translateZ(${z1}px)`,
              color: COLORS.bone,
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: ls1,
              textShadow: '0 4px 24px rgba(0,0,0,.5)',
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
              fontSize: 78,
              fontWeight: 700,
              lineHeight: 1.08,
              marginTop: 6,
              textShadow: '0 0 42px rgba(201,162,75,.35)',
            }}
          >
            {line2}
          </div>

          {/* Rule */}
          <div
            style={{
              height: 2,
              width: ruleW,
              marginTop: 34,
              background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            }}
          />

          {/* Lede */}
          <div
            style={{
              opacity: opL,
              transform: `translateY(${yL}px)`,
              color: COLORS.boneDim,
              fontStyle: 'italic',
              fontSize: 31,
              lineHeight: 1.5,
              maxWidth: 1180,
              marginTop: 30,
            }}
          >
            {lede}
          </div>

          {/* Founding beats */}
          <div
            style={{
              display: 'flex',
              gap: 72,
              marginTop: 50,
              alignItems: 'flex-start',
            }}
          >
            {beats.map(([value, label], i) => {
              const start = 250 + i * 22;
              const opB = interpolate(frame, [start, start + 46], [0, 1], {
                ...clamp,
                easing: ease,
              });
              const yB = interpolate(frame, [start, start + 46], [22, 0], {
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
                    minWidth: 150,
                  }}
                >
                  <span
                    style={{
                      color: COLORS.gold,
                      fontSize: 56,
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </span>
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
