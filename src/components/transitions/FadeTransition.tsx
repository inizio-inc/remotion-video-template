import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ReactNode } from "react";

interface FadeTransitionProps {
  children: ReactNode;
  /** Duration of fade in frames */
  durationInFrames?: number;
  /** Delay before fade starts */
  delay?: number;
  /** Fade direction */
  direction?: "in" | "out" | "in-out";
  /** Total duration for in-out mode */
  totalDuration?: number;
}

/**
 * Fade transition wrapper
 * Fades content in, out, or both
 */
export const FadeTransition: React.FC<FadeTransitionProps> = ({
  children,
  durationInFrames = 15,
  delay = 0,
  direction = "in",
  totalDuration = 60,
}) => {
  const frame = useCurrentFrame();

  let opacity = 1;

  if (direction === "in") {
    opacity = interpolate(frame - delay, [0, durationInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (direction === "out") {
    opacity = interpolate(
      frame - delay,
      [totalDuration - durationInFrames, totalDuration],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  } else {
    // in-out
    const fadeIn = interpolate(frame - delay, [0, durationInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(
      frame - delay,
      [totalDuration - durationInFrames, totalDuration],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    opacity = Math.min(fadeIn, fadeOut);
  }

  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
