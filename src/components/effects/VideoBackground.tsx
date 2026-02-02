import { AbsoluteFill, OffthreadVideo, interpolate, useCurrentFrame, useVideoConfig, staticFile } from "remotion";
import { makeTransform, scale as scaleTransform } from "@remotion/animation-utils";

interface VideoBackgroundProps {
  /** Video source URL or path */
  src: string;
  /** Playback speed (1 = normal, 0.5 = slow-mo) */
  playbackRate?: number;
  /** Starting time in seconds */
  startFrom?: number;
  /** Apply Ken Burns effect */
  kenBurns?: boolean;
  /** Zoom direction for Ken Burns */
  zoomDirection?: "in" | "out";
  /** Scale amount for Ken Burns */
  scaleAmount?: number;
  /** Mute video audio */
  muted?: boolean;
  /** Overlay color (for tinting) */
  overlay?: string;
  /** Overlay opacity */
  overlayOpacity?: number;
  /** Children to overlay on top */
  children?: React.ReactNode;
}

/**
 * Video background with optional Ken Burns effect
 * Great for cinematic backgrounds
 * Uses @remotion/animation-utils for transforms
 */
export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src,
  playbackRate = 1,
  startFrom = 0,
  kenBurns = false,
  zoomDirection = "in",
  scaleAmount = 0.15,
  muted = true,
  overlay,
  overlayOpacity = 0.3,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const videoSrc = src.startsWith("http") ? src : staticFile(src);

  // Ken Burns effect
  const scale = kenBurns
    ? zoomDirection === "in"
      ? interpolate(frame / durationInFrames, [0, 1], [1, 1 + scaleAmount])
      : interpolate(frame / durationInFrames, [0, 1], [1 + scaleAmount, 1])
    : 1;

  const transform = makeTransform([scaleTransform(scale)]);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform }}>
        <OffthreadVideo
          src={videoSrc}
          playbackRate={playbackRate}
          startFrom={startFrom * 30}
          muted={muted}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      {overlay && (
        <AbsoluteFill style={{ backgroundColor: overlay, opacity: overlayOpacity }} />
      )}
      {children}
    </AbsoluteFill>
  );
};
