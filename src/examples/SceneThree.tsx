import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { evolvePath } from '@remotion/paths';

export const SceneThree: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const progress = Math.min(frame / (fps * 2), 1);

  // SVG morphing example
  const path = evolvePath(progress, [
    'M 50,50 L 150,50 L 150,150 L 50,150 Z', // Square
    'M 100,30 L 170,100 L 130,170 L 70,170 L 30,100 Z', // Pentagon
  ]);

  const rotation = interpolate(frame, [0, fps * 3], [0, 360]);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg width="400" height="400" viewBox="0 0 200 200">
        <path
          d={path}
          fill="white"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center',
          }}
        />
      </svg>
      <h2
        style={{
          position: 'absolute',
          bottom: 100,
          fontSize: 48,
          fontWeight: 700,
          color: 'white',
          textAlign: 'center',
        }}
      >
        SVG Morphing
      </h2>
    </AbsoluteFill>
  );
};
