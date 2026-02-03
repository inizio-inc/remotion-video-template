import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const ContentScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const rotation = interpolate(frame, [0, fps * 3], [0, 360]);
  const scale = interpolate(
    frame,
    [0, fps * 1.5, fps * 3],
    [1, 1.3, 1],
    { extrapolateRight: 'clamp' }
  );

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
          d="M 100,30 L 170,100 L 130,170 L 70,170 L 30,100 Z"
          fill="white"
          transform={`rotate(${rotation} 100 100) scale(${scale})`}
          transform-origin="100 100"
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
        CONTENT
      </h2>
    </AbsoluteFill>
  );
};
