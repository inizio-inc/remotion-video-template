import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { ReactNode } from 'react';

interface WhipPanProps {
  children: ReactNode;
  /** Direction of the whip pan */
  direction?: 'left' | 'right' | 'up' | 'down';
  /** Duration in frames */
  duration?: number;
  /** Delay before animation starts */
  delay?: number;
  /** Motion blur amount (0-1) */
  blurAmount?: number;
  /** Whether this is entrance (in) or exit (out) */
  type?: 'in' | 'out';
}

/**
 * Whip Pan Effect
 *
 * Creates a fast camera pan effect with motion blur.
 * Use for dynamic scene transitions or entrances.
 *
 * Usage:
 *   <WhipPan direction="right" type="in">
 *     <YourContent />
 *   </WhipPan>
 */
export const WhipPan: React.FC<WhipPanProps> = ({
  children,
  direction = 'right',
  duration = 15,
  delay = 0,
  blurAmount = 0.8,
  type = 'in',
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);
  const progress = interpolate(adjustedFrame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Reverse progress for exit animation
  const animProgress = type === 'out' ? 1 - progress : progress;

  // Calculate translation based on direction
  const getTranslation = () => {
    const distance = direction === 'left' || direction === 'right' ? width : height;
    const startOffset = type === 'in' ? -distance : 0;
    const endOffset = type === 'in' ? 0 : distance;

    const offset = interpolate(animProgress, [0, 1], [startOffset, endOffset]);

    switch (direction) {
      case 'left':
        return `translateX(${-offset}px)`;
      case 'right':
        return `translateX(${offset}px)`;
      case 'up':
        return `translateY(${-offset}px)`;
      case 'down':
        return `translateY(${offset}px)`;
      default:
        return 'none';
    }
  };

  // Motion blur - strongest in the middle of the animation
  const blurPeak = Math.sin(animProgress * Math.PI);
  const blur = blurPeak * 30 * blurAmount;

  return (
    <AbsoluteFill
      style={{
        transform: getTranslation(),
        filter: blur > 0.5 ? `blur(${blur}px)` : 'none',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export default WhipPan;
