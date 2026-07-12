import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { GRAIN_URI } from './theme';

export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  const x = (frame % 3) * 6 - 6;
  const y = (frame % 5) * 4 - 8;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: GRAIN_URI,
        backgroundRepeat: 'repeat',
        opacity,
        mixBlendMode: 'overlay',
        transform: `translate(${x}px, ${y}px) scale(1.1)`,
        pointerEvents: 'none',
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(120% 100% at 50% 45%, transparent 52%, rgba(0,0,0,.55) 100%)',
      pointerEvents: 'none',
    }}
  />
);
