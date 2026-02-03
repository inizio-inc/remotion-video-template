import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Bangers';
import { makeTransform, scale, translateY } from '@remotion/animation-utils';

const { fontFamily } = loadFont();

interface HookSceneProps {
  text?: string;
  subtext?: string;
  backgroundColor?: string;
  accentColor?: string;
}

/**
 * Hook Scene - Attention-grabbing intro for Reels/TikTok
 * Vertical format optimized (9:16)
 */
export const HookScene: React.FC<HookSceneProps> = ({
  text = "WAIT...",
  subtext = "You need to see this",
  backgroundColor = "#0a0a0a",
  accentColor = "#ff0050",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const subtextEntrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15 },
  });

  const pulse = Math.sin(frame * 0.15) * 0.05 + 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Main hook text */}
      <div
        style={{
          fontFamily,
          fontSize: 120,
          fontWeight: 900,
          color: 'white',
          textAlign: 'center',
          transform: makeTransform([
            scale(entrance * pulse),
            translateY((1 - entrance) * 100),
          ]),
          textShadow: `0 0 60px ${accentColor}, 0 0 120px ${accentColor}50`,
          letterSpacing: '0.05em',
        }}
      >
        {text}
      </div>

      {/* Subtext */}
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 32,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.8)',
          marginTop: 24,
          opacity: Math.max(0, subtextEntrance),
          transform: makeTransform([
            translateY((1 - Math.max(0, subtextEntrance)) * 30),
          ]),
        }}
      >
        {subtext}
      </div>

      {/* Accent line */}
      <div
        style={{
          position: 'absolute',
          bottom: 200,
          width: `${entrance * 60}%`,
          height: 4,
          backgroundColor: accentColor,
          borderRadius: 2,
        }}
      />
    </AbsoluteFill>
  );
};
