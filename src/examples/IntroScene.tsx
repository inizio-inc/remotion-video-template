import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Anton';

const { fontFamily } = loadFont();

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  const opacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const scale = interpolate(titleProgress, [0, 1], [0.8, 1]);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1
        style={{
          fontFamily,
          fontSize: 120,
          fontWeight: 900,
          color: 'white',
          opacity,
          transform: `scale(${scale})`,
          textAlign: 'center',
          letterSpacing: '-0.05em',
        }}
      >
        INTRO
      </h1>
    </AbsoluteFill>
  );
};
