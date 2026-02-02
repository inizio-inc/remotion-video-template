import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { makeTransform, translateX, translateY } from "@remotion/animation-utils";
import { ReactNode } from "react";

type Direction = "left" | "right" | "up" | "down";

interface SlideTransitionProps {
  children: ReactNode;
  /** Direction content slides from */
  direction?: Direction;
  /** Duration in frames */
  durationInFrames?: number;
  /** Delay before animation starts */
  delay?: number;
  /** Use spring physics */
  useSpring?: boolean;
  /** Also fade while sliding */
  fade?: boolean;
}

/**
 * Slide transition - content slides in from any direction
 * Uses @remotion/animation-utils for type-safe transforms
 */
export const SlideTransition: React.FC<SlideTransitionProps> = ({
  children,
  direction = "left",
  durationInFrames = 20,
  delay = 0,
  useSpring: useSpringAnim = true,
  fade = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = useSpringAnim
    ? spring({ fps, frame: adjustedFrame, config: { damping: 200, stiffness: 100 } })
    : interpolate(adjustedFrame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });

  const distance = direction === "left" || direction === "right" ? width : height;
  const offset = interpolate(progress, [0, 1], [distance, 0]);

  const transform = makeTransform([
    direction === "left" ? translateX(-offset) :
    direction === "right" ? translateX(offset) :
    direction === "up" ? translateY(-offset) :
    translateY(offset)
  ]);

  return (
    <AbsoluteFill style={{ transform, opacity: fade ? progress : 1 }}>
      {children}
    </AbsoluteFill>
  );
};
