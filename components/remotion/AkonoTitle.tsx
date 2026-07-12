import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, SERIF } from './theme';
import { FilmGrain, Vignette } from './Layers';

export type AkonoTitleProps = {
  presents: string;
  tagline: string;
  crestSrc?: string;
};

// The AKONO cold-open, enhanced with real CSS-3D depth (perspective scene,
// rotating crest, extruded title). Rendered live in-page by @remotion/player.
export const AkonoTitle: React.FC<AkonoTitleProps> = ({
  presents,
  tagline,
  crestSrc = '/img/crest.png',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ease = Easing.bezier(0.16, 1, 0.3, 1);
  const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

  const barH = 13;
  const barIn = interpolate(frame, [0, 16], [100, 0], { ...clamp, easing: ease });
  const barOut = interpolate(frame, [250, 270], [0, 100], { ...clamp, easing: ease });
  const barOffset = barIn + barOut;

  // Crest — springs up and rotates gently in 3D.
  const crestSpring = spring({ frame: frame - 12, fps, config: { damping: 200, mass: 0.8 } });
  const crestOpacity = interpolate(frame, [12, 44], [0, 1], clamp);
  const crestScale = interpolate(crestSpring, [0, 1], [0.6, 1]);
  const crestRotateY = interpolate(frame, [12, 150], [40, -10], { ...clamp, easing: ease });
  const crestZ = interpolate(crestSpring, [0, 1], [-260, 60]);

  const presentsOpacity = interpolate(frame, [30, 60, 232, 250], [0, 1, 1, 0], clamp);

  const akOpacity = interpolate(frame, [50, 88], [0, 1], { ...clamp, easing: ease });
  const akBlur = interpolate(frame, [50, 92], [22, 0], { ...clamp, easing: ease });
  const akSpacing = interpolate(frame, [50, 96, 250, 270], [52, 20, 20, 32], { ...clamp, easing: ease });
  const akGlow = interpolate(frame, [70, 112], [0, 48], clamp);
  const akZ = interpolate(frame, [50, 96], [-160, 0], { ...clamp, easing: ease });

  const ruleW = interpolate(frame, [102, 138], [0, 560], { ...clamp, easing: ease });
  const tagOpacity = interpolate(frame, [138, 178, 242, 264], [0, 1, 1, 0], clamp);

  const fadeOut = interpolate(frame, [252, 270], [1, 0], clamp);

  // Whole scene breathes with a slow parallax tilt.
  const sceneRotX = interpolate(frame, [0, 270], [4, -3], clamp);
  const sceneRotY = Math.sin(frame / 60) * 2;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper, fontFamily: SERIF }}>
      <AbsoluteFill
        style={{ background: 'radial-gradient(1000px 680px at 50% 42%, rgba(176,85,47,.2), transparent 60%)' }}
      />

      <AbsoluteFill style={{ opacity: fadeOut, perspective: 1600, perspectiveOrigin: '50% 42%' }}>
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            transformStyle: 'preserve-3d',
            transform: `rotateX(${sceneRotX}deg) rotateY(${sceneRotY}deg)`,
          }}
        >
          <div
            style={{
              transform: `translateZ(${crestZ}px) rotateY(${crestRotateY}deg) scale(${crestScale})`,
              opacity: crestOpacity,
              marginBottom: 24,
              transformStyle: 'preserve-3d',
            }}
          >
            <Img
              src={crestSrc}
              style={{ width: 150, height: 'auto', filter: 'drop-shadow(0 18px 40px rgba(0,0,0,.7))' }}
            />
          </div>

          <div
            style={{
              opacity: presentsOpacity,
              color: COLORS.boneDim,
              letterSpacing: 14,
              textTransform: 'uppercase',
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {presents}
          </div>

          <div
            style={{
              opacity: akOpacity,
              filter: `blur(${akBlur}px)`,
              color: COLORS.gold,
              fontSize: 200,
              fontWeight: 800,
              letterSpacing: akSpacing,
              marginTop: 6,
              lineHeight: 1,
              transform: `translateZ(${akZ}px)`,
              textShadow: `0 1px 0 #8a3d24, 0 2px 0 #6f3016, 0 3px 1px rgba(0,0,0,.4), 0 0 ${akGlow}px rgba(201,162,75,.6)`,
            }}
          >
            AKONO
          </div>

          <div
            style={{
              height: 2,
              width: ruleW,
              marginTop: 30,
              background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            }}
          />

          <div
            style={{
              opacity: tagOpacity,
              color: COLORS.goldSoft,
              letterSpacing: 12,
              textTransform: 'uppercase',
              fontSize: 26,
              marginTop: 24,
            }}
          >
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
