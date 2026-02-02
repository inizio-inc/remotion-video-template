import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ReactNode } from "react";

type WipeDirection = "left" | "right" | "up" | "down" | "diagonal";

interface WipeTransitionProps {
  children: ReactNode;
  /** Wipe direction */
  direction?: WipeDirection;
  /** Duration in frames */
  durationInFrames?: number;
  /** Delay before wipe starts */
  delay?: number;
  /** Easing function */
  easing?: (t: number) => number;
}

/**
 * Wipe transition - reveals content with a wipe effect
 */
export const WipeTransition: React.FC<WipeTransitionProps> = ({
  children,
  direction = "left",
  durationInFrames = 20,
  delay = 0,
  easing = Easing.inOut(Easing.cubic),
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = interpolate(adjustedFrame, [0, durationInFrames], [0, 100], {
    extrapolateRight: "clamp",
    easing,
  });

  const getClipPath = () => {
    switch (direction) {
      case "left":
        return `inset(0 ${100 - progress}% 0 0)`;
      case "right":
        return `inset(0 0 0 ${100 - progress}%)`;
      case "up":
        return `inset(0 0 ${100 - progress}% 0)`;
      case "down":
        return `inset(${100 - progress}% 0 0 0)`;
      case "diagonal":
        return `polygon(0 0, ${progress}% 0, ${progress}% ${progress}%, 0 ${progress}%)`;
    }
  };

  return (
    <AbsoluteFill style={{ clipPath: getClipPath() }}>
      {children}
    </AbsoluteFill>
  );
};
