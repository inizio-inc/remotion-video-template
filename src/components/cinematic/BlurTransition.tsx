import { AbsoluteFill, interpolate, Easing, useCurrentFrame } from "remotion";
import { makeTransform, scale as scaleTransform } from "@remotion/animation-utils";
import { ReactNode } from "react";

interface BlurTransitionProps {
  children: ReactNode;
  /** Direction of blur transition */
  direction?: "in" | "out" | "in-out";
  /** Maximum blur amount */
  maxBlur?: number;
  /** Duration of blur transition */
  duration?: number;
  /** Delay before starting */
  delay?: number;
  /** Total duration for in-out mode */
  totalDuration?: number;
  /** Also scale during blur */
  scale?: boolean;
  /** Scale amount */
  scaleAmount?: number;
}

/**
 * Blur transition effect using @remotion/animation-utils
 * Smooth focus/defocus transitions
 */
export const BlurTransition: React.FC<BlurTransitionProps> = ({
  children,
  direction = "in",
  maxBlur = 20,
  duration = 20,
  delay = 0,
  totalDuration = 90,
  scale = true,
  scaleAmount = 0.02,
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);

  let blur = 0;
  let scaleValue = 1;

  if (direction === "in") {
    blur = interpolate(adjustedFrame, [0, duration], [maxBlur, 0], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    if (scale) {
      scaleValue = interpolate(adjustedFrame, [0, duration], [1 + scaleAmount, 1], {
        extrapolateRight: "clamp",
      });
    }
  } else if (direction === "out") {
    blur = interpolate(
      adjustedFrame,
      [totalDuration - duration, totalDuration],
      [0, maxBlur],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) }
    );
    if (scale) {
      scaleValue = interpolate(
        adjustedFrame,
        [totalDuration - duration, totalDuration],
        [1, 1 + scaleAmount],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
  } else {
    const blurIn = interpolate(adjustedFrame, [0, duration], [maxBlur, 0], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const blurOut = interpolate(
      adjustedFrame,
      [totalDuration - duration, totalDuration],
      [0, maxBlur],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) }
    );
    blur = Math.max(blurIn, blurOut);

    if (scale) {
      const scaleIn = interpolate(adjustedFrame, [0, duration], [1 + scaleAmount, 1], {
        extrapolateRight: "clamp",
      });
      const scaleOut = interpolate(
        adjustedFrame,
        [totalDuration - duration, totalDuration],
        [1, 1 + scaleAmount],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
      scaleValue = adjustedFrame < totalDuration - duration ? scaleIn : scaleOut;
    }
  }

  const transform = makeTransform([scaleTransform(scaleValue)]);

  return (
    <AbsoluteFill style={{ filter: blur > 0.1 ? `blur(${blur}px)` : "none", transform }}>
      {children}
    </AbsoluteFill>
  );
};
