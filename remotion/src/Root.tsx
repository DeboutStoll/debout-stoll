import React from 'react';
import { Composition } from 'remotion';
import { AkonoTitle, AKONO_DURATION } from './AkonoTitle';
import { StatDecline } from './StatDecline';

// Registered compositions — visible in Remotion Studio and renderable by id.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AkonoTitle"
        component={AkonoTitle}
        durationInFrames={AKONO_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          presents: 'Le réseau des anciens présente',
          tagline: 'Séminaire · Mission · Collège',
        }}
      />
      <Composition
        id="StatDecline"
        component={StatDecline}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
