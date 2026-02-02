import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { makeTransform, translateY } from "@remotion/animation-utils";
import { useResponsiveFontSize, useVideoFormat } from "../../utils";

interface FadeInWordsProps {
  text: string;
  /** Delay between each word in frames */
  wordDelay?: number;
  /** Animation duration per word */
  wordDuration?: number;
  /** Starting delay */
  delay?: number;
  /** Font size (auto-adjusts for portrait) */
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  fontFamily?: string;
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Line height multiplier */
  lineHeight?: number;
  style?: React.CSSProperties;
}

/**
 * Word-by-word fade in animation
 * Uses @remotion/animation-utils for transforms
 */
export const FadeInWords: React.FC<FadeInWordsProps> = ({
  text,
  wordDelay = 4,
  delay = 0,
  fontSize = 48,
  color = "#ffffff",
  fontWeight = 600,
  fontFamily = "Inter, sans-serif",
  align = "center",
  lineHeight = 1.4,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isPortrait } = useVideoFormat();
  const responsiveFontSize = useResponsiveFontSize(fontSize);

  const words = text.split(" ");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        gap: isPortrait ? "8px 12px" : "12px 16px",
        padding: isPortrait ? "0 40px" : "0 80px",
        lineHeight,
        ...style,
      }}
    >
      {words.map((word, index) => {
        const wordStartFrame = delay + index * wordDelay;
        const adjustedFrame = Math.max(0, frame - wordStartFrame);

        const progress = spring({
          fps,
          frame: adjustedFrame,
          config: { damping: 200, stiffness: 100 },
        });

        const yOffset = interpolate(progress, [0, 1], [20, 0]);
        const transform = makeTransform([translateY(yOffset)]);

        return (
          <span
            key={index}
            style={{
              fontSize: responsiveFontSize,
              color,
              fontWeight,
              fontFamily,
              opacity: progress,
              transform,
              display: "inline-block",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
