import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ReactNode } from 'react';

interface ZoomBlurProps {
  children: ReactNode;
  /** Duration in frames */
  duration?: number;
  /** Delay before animation starts */
  delay?: number;
  /** Whether zooming in or out */
  direction?: 'in' | 'out';
  /** Starting/ending scale */
  scaleFrom?: number;
  /** Target scale */
  scaleTo?: number;
  /** Maximum blur amount */
  maxBlur?: number;
  /** Whether this is entrance or exit */
  type?: 'enter' | 'exit';
}

/**
 * Zoom Blur Effect
 *
 * Creates a zoom with radial blur effect for dramatic transitions.
 * Commonly used for impact moments or scene transitions.
 *
 * Usage:
 *   <ZoomBlur direction="in" type="enter">
 *     <YourContent />
 *   </ZoomBlur>
 */
export const ZoomBlur: React.FC<ZoomBlurProps> = ({
  children,
  duration = 20,
  delay = 0,
  direction = 'in',
  scaleFrom,
  scaleTo,
  maxBlur = 15,
  type = 'enter',
}) => {
  const frame = useCurrentFrame();

  const adjustedFrame = Math.max(0, frame - delay);
  const progress = interpolate(adjustedFrame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Determine scale values based on direction and type
  const defaultScaleFrom = direction === 'in' ? 0.5 : 1.5;
  const defaultScaleTo = 1;

  let startScale = scaleFrom ?? defaultScaleFrom;
  let endScale = scaleTo ?? defaultScaleTo;

  // Reverse for exit animations
  if (type === 'exit') {
    [startScale, endScale] = [endScale, startScale];
  }

  const scale = interpolate(progress, [0, 1], [startScale, endScale]);

  // Blur peaks in the middle of the animation, creating motion blur feel
  const blurProgress = Math.sin(progress * Math.PI);
  const blur = blurProgress * maxBlur;

  // Opacity - fade in/out at the edges
  const opacity = type === 'enter'
    ? interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' })
    : interpolate(progress, [0.7, 1], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        filter: blur > 0.5 ? `blur(${blur}px)` : 'none',
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Zoom Punch Effect
 *
 * Quick zoom punch for impact moments (like bass drops).
 * Zooms in quickly then returns to normal.
 */
export const ZoomPunch: React.FC<{
  children: ReactNode;
  /** Duration in frames */
  duration?: number;
  /** Delay before animation */
  delay?: number;
  /** Scale at punch peak */
  punchScale?: number;
}> = ({
  children,
  duration = 10,
  delay = 0,
  punchScale = 1.1,
}) => {
  const frame = useCurrentFrame();

  const adjustedFrame = Math.max(0, frame - delay);
  const progress = interpolate(adjustedFrame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Quick punch - fast in, slower out
  const scale = interpolate(
    progress,
    [0, 0.3, 1],
    [1, punchScale, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};

export default ZoomBlur;
