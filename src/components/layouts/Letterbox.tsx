import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ReactNode } from "react";

interface LetterboxProps {
  children: ReactNode;
  /** Target aspect ratio (e.g., 2.35 for cinemascope) */
  aspectRatio?: number;
  /** Bar color */
  color?: string;
  /** Animate bars in */
  animate?: boolean;
  /** Animation duration in frames */
  animationDuration?: number;
  /** Delay before animation */
  delay?: number;
}

/**
 * Cinematic letterbox effect
 * Adds black bars for widescreen look
 */
export const Letterbox: React.FC<LetterboxProps> = ({
  children,
  aspectRatio = 2.35,
  color = "#000000",
  animate = false,
  animationDuration = 30,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const currentAspect = width / height;

  // Calculate bar sizes
  let barHeight = 0;
  let barWidth = 0;

  if (aspectRatio > currentAspect) {
    // Add horizontal bars (top/bottom)
    const targetHeight = width / aspectRatio;
    barHeight = (height - targetHeight) / 2;
  } else {
    // Add vertical bars (left/right) - pillarbox
    const targetWidth = height * aspectRatio;
    barWidth = (width - targetWidth) / 2;
  }

  // Animation
  let progress = 1;
  if (animate) {
    const adjustedFrame = Math.max(0, frame - delay);
    progress = interpolate(adjustedFrame, [0, animationDuration], [0, 1], {
      extrapolateRight: "clamp",
    });
  }

  const animatedBarHeight = barHeight * progress;
  const animatedBarWidth = barWidth * progress;

  return (
    <AbsoluteFill>
      {children}

      {/* Top/Left bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: barWidth > 0 ? animatedBarWidth : "100%",
          height: barHeight > 0 ? animatedBarHeight : "100%",
          backgroundColor: color,
          zIndex: 100,
        }}
      />

      {/* Bottom/Right bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: barWidth > 0 ? animatedBarWidth : "100%",
          height: barHeight > 0 ? animatedBarHeight : "100%",
          backgroundColor: color,
          zIndex: 100,
        }}
      />
    </AbsoluteFill>
  );
};
