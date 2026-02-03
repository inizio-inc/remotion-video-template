import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Bangers';
import { makeTransform, scale, translateY, rotate } from '@remotion/animation-utils';

const { fontFamily } = loadFont();

interface CTASceneProps {
  mainText?: string;
  ctaText?: string;
  handle?: string;
  backgroundColor?: string;
  accentColor?: string;
}

/**
 * CTA Scene - Call to action ending for Reels/TikTok
 * Encourages follows, likes, shares
 */
export const CTAScene: React.FC<CTASceneProps> = ({
  mainText = "FOLLOW",
  ctaText = "for more tips",
  handle = "@username",
  backgroundColor = "#0a0a0a",
  accentColor = "#ff0050",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  const handleEntrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15 },
  });

  // Pulsing effect
  const pulse = interpolate(
    Math.sin(frame * 0.2),
    [-1, 1],
    [0.95, 1.05]
  );

  // Floating particles/emojis
  const emojis = ['✨', '🔥', '💯', '⚡'];

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Floating emojis */}
      {emojis.map((emoji, index) => {
        const delay = index * 8;
        const emojiEntrance = spring({
          frame: frame - delay,
          fps,
          config: { damping: 8, stiffness: 100 },
        });

        const floatY = Math.sin((frame + index * 20) * 0.1) * 20;
        const angle = (index / emojis.length) * 360;
        const radius = 250;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              fontSize: 48,
              opacity: Math.max(0, emojiEntrance) * 0.8,
              transform: makeTransform([
                translateY(floatY + (1 - Math.max(0, emojiEntrance)) * 100),
              ]),
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
            }}
          >
            {emoji}
          </div>
        );
      })}

      {/* Main CTA text */}
      <div
        style={{
          fontFamily,
          fontSize: 140,
          fontWeight: 900,
          color: accentColor,
          textAlign: 'center',
          transform: makeTransform([
            scale(entrance * pulse),
            rotate((1 - entrance) * -10),
          ]),
          textShadow: `0 0 80px ${accentColor}, 0 4px 0 #000`,
          letterSpacing: '0.05em',
        }}
      >
        {mainText}
      </div>

      {/* Subtext */}
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 36,
          fontWeight: 500,
          color: 'white',
          marginTop: 16,
          opacity: Math.max(0, handleEntrance),
          transform: makeTransform([
            translateY((1 - Math.max(0, handleEntrance)) * 30),
          ]),
        }}
      >
        {ctaText}
      </div>

      {/* Handle */}
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 28,
          fontWeight: 700,
          color: accentColor,
          marginTop: 40,
          opacity: Math.max(0, handleEntrance),
          padding: '12px 32px',
          border: `3px solid ${accentColor}`,
          borderRadius: 50,
          transform: makeTransform([
            scale(Math.max(0, handleEntrance)),
          ]),
        }}
      >
        {handle}
      </div>

      {/* Animated arrow pointing up (to follow button) */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          fontSize: 60,
          opacity: interpolate(frame % 30, [0, 15, 30], [0.3, 1, 0.3]),
          transform: makeTransform([
            translateY(Math.sin(frame * 0.3) * 10),
          ]),
        }}
      >
        👆
      </div>
    </AbsoluteFill>
  );
};
