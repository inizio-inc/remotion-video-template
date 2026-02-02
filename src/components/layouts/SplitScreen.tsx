import { AbsoluteFill, useVideoConfig } from "remotion";
import { ReactNode } from "react";
import { useVideoFormat } from "../../utils";

interface SplitScreenProps {
  /** Left/Top content */
  left: ReactNode;
  /** Right/Bottom content */
  right: ReactNode;
  /** Split ratio (0-1, where 0.5 is equal split) */
  ratio?: number;
  /** Gap between panels in pixels */
  gap?: number;
  /** Override direction (auto-detects based on format) */
  direction?: "horizontal" | "vertical" | "auto";
}

/**
 * Split screen layout
 * Auto-adapts: horizontal split for landscape, vertical for portrait
 */
export const SplitScreen: React.FC<SplitScreenProps> = ({
  left,
  right,
  ratio = 0.5,
  gap = 0,
  direction = "auto",
}) => {
  const { width, height } = useVideoConfig();
  const { isPortrait } = useVideoFormat();

  const isVertical =
    direction === "vertical" || (direction === "auto" && isPortrait);

  if (isVertical) {
    const topHeight = height * ratio - gap / 2;
    const bottomHeight = height * (1 - ratio) - gap / 2;

    return (
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: topHeight,
            overflow: "hidden",
          }}
        >
          {left}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: bottomHeight,
            overflow: "hidden",
          }}
        >
          {right}
        </div>
      </AbsoluteFill>
    );
  }

  const leftWidth = width * ratio - gap / 2;
  const rightWidth = width * (1 - ratio) - gap / 2;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: leftWidth,
          height: "100%",
          overflow: "hidden",
        }}
      >
        {left}
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: rightWidth,
          height: "100%",
          overflow: "hidden",
        }}
      >
        {right}
      </div>
    </AbsoluteFill>
  );
};
