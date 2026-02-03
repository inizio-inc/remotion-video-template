import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Righteous';

const { fontFamily } = loadFont();

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  const opacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const translateY = interpolate(titleProgress, [0, 1], [50, 0]);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1
        style={{
          fontFamily,
          fontSize: 120,
          fontWeight: 400,
          color: 'white',
          opacity,
          transform: `translateY(${translateY}px)`,
          textAlign: 'center',
          letterSpacing: '-0.02em',
        }}
      >
        HOOK
      </h1>
    </AbsoluteFill>
  );
};
