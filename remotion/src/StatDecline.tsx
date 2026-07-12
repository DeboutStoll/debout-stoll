import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, SERIF } from './theme';
import { FilmGrain, Vignette } from './Layers';

/**
 * Animated data segment — the collapse from 1,500 pupils (2004) to fewer than
 * 200 today, told with two bars and a counting figure. 1920×1080, 30fps, 8s.
 */
export const StatDecline: React.FC = () => {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(0.16, 1, 0.3, 1);
  const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

  const fadeIn = interpolate(frame, [0, 20], [0, 1], clamp);
  const fadeOut = interpolate(frame, [222, 240], [1, 0], clamp);
  const opacity = Math.min(fadeIn, fadeOut);

  const maxH = 460;
  const barA = interpolate(frame, [22, 78], [0, 1], { ...clamp, easing: ease }); // 2004 → full
  const barB = interpolate(frame, [50, 108], [0, 190 / 1500], { ...clamp, easing: ease }); // today
  const count = Math.round(
    interpolate(frame, [55, 150], [1500, 190], { ...clamp, easing: ease }),
  );
  const showLess = frame > 150;
  const lineOpacity = interpolate(frame, [158, 192], [0, 1], clamp);

  const bar = (heightRatio: number, from: string, to: string) => ({
    width: 150,
    height: maxH * heightRatio,
    background: `linear-gradient(180deg, ${from}, ${to})`,
    borderRadius: 6,
    alignSelf: 'flex-end' as const,
    boxShadow: '0 20px 60px -20px rgba(0,0,0,.8)',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper, fontFamily: SERIF }}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(1000px 640px at 50% 30%, rgba(138,61,36,.2), transparent 60%)',
        }}
      />

      <AbsoluteFill style={{ opacity, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ color: COLORS.laterite2, letterSpacing: 16, textTransform: 'uppercase', fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
          SOS · Collège Stoll d'Akono
        </div>
        <div style={{ color: COLORS.gold, fontSize: 150, fontWeight: 800, lineHeight: 1 }}>
          {showLess ? '< 200' : count.toLocaleString('fr-FR')}
        </div>
        <div style={{ color: COLORS.boneDim, fontSize: 26, letterSpacing: 4, marginTop: 6 }}>
          {showLess ? "élèves aujourd'hui" : 'élèves'}
        </div>

        <div style={{ display: 'flex', gap: 90, alignItems: 'flex-end', height: maxH + 60, marginTop: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, height: '100%', justifyContent: 'flex-end' }}>
            <div style={bar(barA, COLORS.laterite2, COLORS.laterite)} />
            <div style={{ color: COLORS.bone, fontSize: 24, fontWeight: 700 }}>1 500</div>
            <div style={{ color: COLORS.boneDim, fontSize: 18, letterSpacing: 3, textTransform: 'uppercase' }}>2004</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, height: '100%', justifyContent: 'flex-end' }}>
            <div style={bar(barB, COLORS.gold, COLORS.laterite)} />
            <div style={{ color: COLORS.bone, fontSize: 24, fontWeight: 700 }}>&lt; 200</div>
            <div style={{ color: COLORS.boneDim, fontSize: 18, letterSpacing: 3, textTransform: 'uppercase' }}>Aujourd'hui</div>
          </div>
        </div>

        <div style={{ opacity: lineOpacity, color: COLORS.goldSoft, fontStyle: 'italic', fontSize: 30, marginTop: 44, maxWidth: 1000, textAlign: 'center' }}>
          Un héritage ne meurt pas de vieillesse : il meurt d'oubli.
        </div>
      </AbsoluteFill>

      <FilmGrain />
      <Vignette />
    </AbsoluteFill>
  );
};
