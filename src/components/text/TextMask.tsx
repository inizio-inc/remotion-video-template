import { AbsoluteFill, Img, OffthreadVideo, spring, useCurrentFrame, useVideoConfig, staticFile, random } from "remotion";
import { fitText } from "@remotion/layout-utils";
import { makeTransform, scale as scaleTransform } from "@remotion/animation-utils";
import { useMemo } from "react";

interface TextMaskProps {
  /** Text to display - supports \n for line breaks */
  text: string;
  /** Image source to show through text */
  imageSrc?: string;
  /** Video source to show through text */
  videoSrc?: string;
  /** Video start time in seconds */
  videoStartFrom?: number;
  /** Font weight */
  fontWeight?: number;
  /** Font family */
  fontFamily?: string;
  /** Letter spacing */
  letterSpacing?: number;
  /** Target width percentage of screen (0-1) */
  fillWidth?: number;
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Animate entrance */
  animate?: boolean;
  /** Animation delay */
  delay?: number;
  /** Background color (visible around text) */
  backgroundColor?: string;
}

/**
 * Text Mask - reveals image/video through text letters
 * Auto-sizes text to fill specified percentage of screen width
 * Uses SVG clipPath for video support
 */
export const TextMask: React.FC<TextMaskProps> = ({
  text,
  imageSrc,
  videoSrc,
  videoStartFrom = 0,
  fontWeight = 900,
  fontFamily = "Inter, -apple-system, sans-serif",
  letterSpacing = -0.02,
  fillWidth = 0.9,
  align = "center",
  animate = true,
  delay = 0,
  backgroundColor = "#0a0a0a",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);
  const progress = animate
    ? spring({ fps, frame: adjustedFrame, config: { damping: 200, stiffness: 80 } })
    : 1;

  const scaleValue = animate ? 0.95 + progress * 0.05 : 1;
  const transform = makeTransform([scaleTransform(scaleValue)]);

  const lines = text.split("\n");
  const longestLine = lines.reduce((a, b) => a.length > b.length ? a : b, "");

  // Calculate font size to fill the target width
  const targetWidth = width * fillWidth;
  const { fontSize } = fitText({
    text: longestLine.toUpperCase(),
    withinWidth: targetWidth,
    fontFamily,
    fontWeight,
  });

  // Cap font size for very short text
  const maxFontSize = height * 0.3;
  const finalFontSize = Math.min(fontSize, maxFontSize);

  // Generate unique ID for this instance
  const clipId = useMemo(() => `text-clip-${random(text).toString(36).substr(2, 9)}`, [text]);

  // Calculate text position
  const textX = align === "center" ? "50%" : align === "right" ? "95%" : "5%";
  const textAnchor = align === "center" ? "middle" : align === "right" ? "end" : "start";

  // Resolve media source
  const resolvedImageSrc = imageSrc && !imageSrc.startsWith("http") ? staticFile(imageSrc) : imageSrc;
  const resolvedVideoSrc = videoSrc && !videoSrc.startsWith("http") ? staticFile(videoSrc) : videoSrc;

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* SVG clipPath definition */}
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
        <defs>
          <clipPath id={clipId}>
            {lines.map((line, i) => {
              const lineCount = lines.length;
              const totalTextHeight = lineCount * finalFontSize * 1.05;
              const startY = (height - totalTextHeight) / 2 + finalFontSize * 0.8;
              const y = startY + i * finalFontSize * 1.05;

              return (
                <text
                  key={i}
                  x={textX}
                  y={y}
                  textAnchor={textAnchor}
                  style={{
                    fontSize: finalFontSize,
                    fontWeight,
                    fontFamily,
                    letterSpacing: `${letterSpacing}em`,
                    textTransform: "uppercase",
                  }}
                >
                  {line}
                </text>
              );
            })}
          </clipPath>
        </defs>
      </svg>

      {/* Media layer clipped to text shape */}
      <AbsoluteFill
        style={{
          clipPath: `url(#${clipId})`,
          WebkitClipPath: `url(#${clipId})`,
          opacity: progress,
          transform,
        }}
      >
        {resolvedVideoSrc ? (
          <OffthreadVideo
            src={resolvedVideoSrc}
            startFrom={Math.floor(videoStartFrom * fps)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : resolvedImageSrc ? (
          <Img
            src={resolvedImageSrc}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
