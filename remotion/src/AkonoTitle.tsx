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
import { FilmGrain, Vignette } from './Layers';

export type AkonoTitleProps = {
  presents: string;
  tagline: string;
};

/**
 * The AKONO studio cold-open — the website's intro rebuilt as a real,
 * exportable film clip: letterbox bars close in, the crest rises, "AKONO"
 * resolves from blur with a gold glow, a rule draws, the era tagline appears,
 * then the frame fades. 1920×1080, 30fps, 9s.
 */
export const AkonoTitle: React.FC<AkonoTitleProps> = ({ presents, tagline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ease = Easing.bezier(0.16, 1, 0.3, 1);
  const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

  // Letterbox bars — slide in, hold, then part.
  const barH = 13;
  const barIn = interpolate(frame, [0, 16], [100, 0], { ...clamp, easing: ease });
  const barOut = interpolate(frame, [250, 270], [0, 100], { ...clamp, easing: ease });
  const barOffset = barIn + barOut;

  // Crest.
  const crestSpring = spring({ frame: frame - 12, fps, config: { damping: 200, mass: 0.8 } });
  const crestOpacity = interpolate(frame, [12, 44], [0, 1], clamp);
  const crestScale = interpolate(crestSpring, [0, 1], [0.7, 1]);

  const presentsOpacity = interpolate(frame, [30, 60, 232, 250], [0, 1, 1, 0], clamp);

  // AKONO resolves from blur + wide letter-spacing.
  const akOpacity = interpolate(frame, [50, 88], [0, 1], { ...clamp, easing: ease });
  const akBlur = interpolate(frame, [50, 92], [18, 0], { ...clamp, easing: ease });
  const akSpacing = interpolate(frame, [50, 96, 250, 270], [46, 20, 20, 30], { ...clamp, easing: ease });
  const akGlow = interpolate(frame, [70, 112], [0, 46], clamp);

  const ruleW = interpolate(frame, [102, 138], [0, 540], { ...clamp, easing: ease });
  const tagOpacity = interpolate(frame, [138, 178, 242, 264], [0, 1, 1, 0], clamp);

  const fadeOut = interpolate(frame, [252, 270], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper, fontFamily: SERIF }}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(900px 620px at 50% 42%, rgba(176,85,47,.18), transparent 60%)',
        }}
      />

      <AbsoluteFill
        style={{
          opacity: fadeOut,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div style={{ transform: `scale(${crestScale})`, opacity: crestOpacity, marginBottom: 24 }}>
          <Img
            src={staticFile('crest.png')}
            style={{ width: 150, height: 'auto', filter: 'drop-shadow(0 12px 30px rgba(0,0,0,.6))' }}
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
            fontSize: 190,
            fontWeight: 800,
            letterSpacing: akSpacing,
            marginTop: 8,
            lineHeight: 1,
            textShadow: `0 0 ${akGlow}px rgba(201,162,75,.55)`,
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

      <FilmGrain />
      <Vignette />

      <div
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: `${barH}%`, background: '#000', transform: `translateY(-${barOffset}%)` }}
      />
      <div
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${barH}%`, background: '#000', transform: `translateY(${barOffset}%)` }}
      />
    </AbsoluteFill>
  );
};
