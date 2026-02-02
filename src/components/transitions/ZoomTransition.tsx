import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { makeTransform, scale as scaleTransform } from "@remotion/animation-utils";
import { ReactNode } from "react";

interface ZoomTransitionProps {
  children: ReactNode;
  /** Zoom direction */
  direction?: "in" | "out";
  /** Starting/ending scale */
  scale?: number;
  /** Duration in frames */
  durationInFrames?: number;
  /** Delay before animation */
  delay?: number;
  /** Use spring physics */
  useSpring?: boolean;
  /** Also fade */
  fade?: boolean;
}

/**
 * Zoom transition - content zooms in or out
 * Uses @remotion/animation-utils for type-safe transforms
 */
export const ZoomTransition: React.FC<ZoomTransitionProps> = ({
  children,
  direction = "in",
  scale = 0.8,
  durationInFrames = 20,
  delay = 0,
  useSpring: useSpringAnim = true,
  fade = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = useSpringAnim
    ? spring({ fps, frame: adjustedFrame, config: { damping: 200, stiffness: 80 } })
    : interpolate(adjustedFrame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });

  const scaleValue = direction === "in"
    ? interpolate(progress, [0, 1], [scale, 1])
    : interpolate(progress, [0, 1], [1, scale]);

  const transform = makeTransform([scaleTransform(scaleValue)]);

  return (
    <AbsoluteFill style={{ transform, opacity: fade ? progress : 1 }}>
      {children}
    </AbsoluteFill>
  );
};
