import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, SERIF } from './theme';
import { Embers, FilmGrain, Vignette } from './Layers';

export type AkonoTitleProps = {
  presents: string;
  tagline: string;
};

export const AKONO_DURATION = 450; // 15s @ 30fps

// The AKONO cold-open — longer, more dramatic build (see the in-site copy in
// components/remotion/AkonoTitle.tsx for the matching version).
export const AkonoTitle: React.FC<AkonoTitleProps> = ({ presents, tagline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ease = Easing.bezier(0.16, 1, 0.3, 1);
  const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

  const barH = 15;
  const barIn = interpolate(frame, [0, 26], [100, 0], { ...clamp, easing: ease });
  const barOut = interpolate(frame, [420, 450], [0, 100], { ...clamp, easing: ease });
  const barOffset = barIn + barOut;

  const glowOpacity = interpolate(frame, [0, 70], [0, 1], clamp);
  const emberOpacity = interpolate(frame, [30, 90, 410, 445], [0, 1, 1, 0], clamp);
  const presentsOpacity = interpolate(frame, [38, 78, 150, 180], [0, 1, 1, 0], clamp);

  const crestSpring = spring({ frame: frame - 80, fps, config: { damping: 200, mass: 1 } });
  const crestOpacity = interpolate(frame, [80, 120], [0, 1], clamp);
  const crestScale = interpolate(crestSpring, [0, 1], [0.55, 1]);
  const crestRotateY = interpolate(frame, [80, 300], [42, -8], { ...clamp, easing: ease });
  const crestZ = interpolate(crestSpring, [0, 1], [-340, 60]);
  const sheenX = interpolate(frame, [140, 205], [-140, 160], { ...clamp, easing: ease });
  const sheenOpacity = interpolate(frame, [140, 160, 190, 205], [0, 0.5, 0.5, 0], clamp);

  const akOpacity = interpolate(frame, [150, 214], [0, 1], { ...clamp, easing: ease });
  const akBlur = interpolate(frame, [150, 224], [28, 0], { ...clamp, easing: ease });
  const akSpacing = interpolate(frame, [150, 232, 410, 450], [64, 22, 22, 36], { ...clamp, easing: ease });
  const akGlow = interpolate(frame, [190, 280], [0, 56], clamp);
  const akZ = interpolate(frame, [150, 232], [-240, 0], { ...clamp, easing: ease });

  const ruleW = interpolate(frame, [250, 300], [0, 600], { ...clamp, easing: ease });
  const tagOpacity = interpolate(frame, [300, 350, 405, 430], [0, 1, 1, 0], clamp);
  const fadeOut = interpolate(frame, [424, 450], [1, 0], clamp);

  const push = interpolate(frame, [0, 450], [1, 1.1], clamp);
  const sceneRotX = interpolate(frame, [0, 450], [5, -4], clamp);
  const sceneRotY = Math.sin(frame / 70) * 2.4;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper, fontFamily: SERIF }}>
      <AbsoluteFill
        style={{
          opacity: glowOpacity,
          background: 'radial-gradient(1100px 720px at 50% 42%, rgba(176,85,47,.24), transparent 62%)',
        }}
      />
      <Embers count={30} opacity={emberOpacity} />

      {/* "presents" credit — spread edge-to-edge across the top band */}
      <div
        style={{
          position: 'absolute',
          top: '17%',
          left: 0,
          right: 0,
          padding: '0 5%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: presentsOpacity,
          color: COLORS.boneDim,
          fontSize: 32,
          fontWeight: 600,
          letterSpacing: 3,
          textTransform: 'uppercase',
          zIndex: 2,
        }}
      >
        {presents.split(' ').map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>

      <AbsoluteFill style={{ opacity: fadeOut, perspective: 1700, perspectiveOrigin: '50% 42%' }}>
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            transformStyle: 'preserve-3d',
            transform: `scale(${push}) rotateX(${sceneRotX}deg) rotateY(${sceneRotY}deg)`,
          }}
        >
          <div
            style={{
              position: 'relative',
              transform: `translateZ(${crestZ}px) rotateY(${crestRotateY}deg) scale(${crestScale})`,
              opacity: crestOpacity,
              marginBottom: 26,
              transformStyle: 'preserve-3d',
            }}
          >
            <Img
              src={staticFile('crest.png')}
              style={{ width: 156, height: 'auto', filter: 'drop-shadow(0 20px 44px rgba(0,0,0,.72))' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: sheenOpacity,
                background: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,.55) 50%, transparent 60%)',
                transform: `translateX(${sheenX}px)`,
                mixBlendMode: 'screen',
              }}
            />
          </div>

          <div
            style={{
              opacity: akOpacity,
              filter: `blur(${akBlur}px)`,
              color: COLORS.gold,
              fontSize: 210,
              fontWeight: 800,
              letterSpacing: akSpacing,
              marginTop: 6,
              lineHeight: 1,
              transform: `translateZ(${akZ}px)`,
              textShadow: `0 1px 0 #8a3d24, 0 2px 0 #6f3016, 0 4px 2px rgba(0,0,0,.45), 0 0 ${akGlow}px rgba(201,162,75,.65)`,
            }}
          >
            AKONO
          </div>

          <div style={{ height: 2, width: ruleW, marginTop: 32, background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)` }} />

          <div style={{ opacity: tagOpacity, color: COLORS.goldSoft, letterSpacing: 12, textTransform: 'uppercase', fontSize: 26, marginTop: 26 }}>
            {tagline}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      <FilmGrain />
      <Vignette />

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: `${barH}%`, background: '#000', transform: `translateY(-${barOffset}%)` }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${barH}%`, background: '#000', transform: `translateY(${barOffset}%)` }} />
    </AbsoluteFill>
  );
};
