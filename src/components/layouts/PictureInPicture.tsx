import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D } from "@remotion/noise";
import { makeTransform, scale as scaleTransform, translate, rotate } from "@remotion/animation-utils";
import { ReactNode } from "react";
import { useVideoFormat } from "../utils";

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface PictureInPictureProps {
  /** Main/background content */
  main: ReactNode;
  /** PIP overlay content */
  pip: ReactNode;
  /** PIP position */
  position?: Position;
  /** PIP size as percentage of width */
  size?: number;
  /** Border radius */
  borderRadius?: number;
  /** Border width */
  borderWidth?: number;
  /** Border color */
  borderColor?: string;
  /** Shadow */
  shadow?: boolean;
  /** Animate entrance */
  animate?: boolean;
  /** Animation delay */
  delay?: number;
  /** Enable floating animation */
  float?: boolean;
  /** Float intensity */
  floatIntensity?: number;
}

/**
 * Picture-in-Picture layout with floating animation
 * Uses @remotion/noise for natural float and @remotion/animation-utils for transforms
 */
export const PictureInPicture: React.FC<PictureInPictureProps> = ({
  main,
  pip,
  position = "bottom-right",
  size = 0.3,
  borderRadius = 12,
  borderWidth = 3,
  borderColor = "#ffffff",
  shadow = true,
  animate = true,
  delay = 0,
  float = true,
  floatIntensity = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const { isPortrait } = useVideoFormat();

  const responsiveSize = isPortrait ? size * 1.2 : size;
  const pipWidth = width * responsiveSize;
  const pipHeight = (pipWidth * 9) / 16;
  const margin = isPortrait ? 20 : 40;

  const positions: Record<Position, { top?: number; bottom?: number; left?: number; right?: number }> = {
    "top-left": { top: margin, left: margin },
    "top-right": { top: margin, right: margin },
    "bottom-left": { bottom: margin, left: margin },
    "bottom-right": { bottom: margin, right: margin },
  };

  // Entrance animation
  const adjustedFrame = Math.max(0, frame - delay);
  const progress = animate
    ? spring({ fps, frame: adjustedFrame, config: { damping: 200, stiffness: 80 } })
    : 1;
  const scale = interpolate(progress, [0, 1], [0.5, 1]);
  const entranceOffset = interpolate(progress, [0, 1], [50, 0]);

  // Floating animation using noise for more natural movement
  const floatFrame = Math.max(0, frame - delay - 30) * 0.02;
  const floatX = float && frame > delay + 30 ? noise2D("pip-x", floatFrame, 0) * floatIntensity * 0.5 : 0;
  const floatY = float && frame > delay + 30 ? noise2D("pip-y", 0, floatFrame) * floatIntensity : 0;
  const floatRotate = float && frame > delay + 30 ? noise2D("pip-r", floatFrame, floatFrame) * 1 : 0;

  const transform = makeTransform([
    scaleTransform(scale),
    translate(floatX, floatY),
    rotate(floatRotate),
  ]);

  const posStyle = positions[position];
  const isBottom = position.includes("bottom");

  return (
    <AbsoluteFill>
      {main}
      <div
        style={{
          position: "absolute",
          ...posStyle,
          ...(isBottom ? { bottom: (posStyle.bottom ?? 0) + entranceOffset } : { top: (posStyle.top ?? 0) + entranceOffset }),
          width: pipWidth,
          height: pipHeight,
          borderRadius,
          border: `${borderWidth}px solid ${borderColor}`,
          overflow: "hidden",
          transform,
          opacity: progress,
          boxShadow: shadow ? `0 10px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)` : "none",
        }}
      >
        {pip}
      </div>
    </AbsoluteFill>
  );
};
