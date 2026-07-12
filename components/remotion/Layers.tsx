import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, GRAIN_URI } from './theme';

// Floating gold embers drifting upward — deterministic (frame-based) so it
// renders identically every pass.
export const Embers: React.FC<{ count?: number; opacity?: number }> = ({
  count = 30,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
      {Array.from({ length: count }).map((_, i) => {
        const seedX = ((i * 97) % 100) / 100;
        const speed = 0.35 + (i % 5) * 0.14;
        const drift = Math.sin(frame / 42 + i) * 34;
        const y = height + 40 - ((frame * speed + i * 63) % (height + 120));
        const size = 2 + (i % 4);
        const op = 0.12 + 0.4 * Math.abs(Math.sin(frame / 26 + i));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: seedX * width + drift,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: COLORS.goldSoft,
              boxShadow: `0 0 ${6 + size}px rgba(201,162,75,.9)`,
              opacity: op,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

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
