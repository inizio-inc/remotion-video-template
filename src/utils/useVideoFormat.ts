import { useVideoConfig } from "remotion";

export type VideoFormat = "landscape" | "portrait" | "square";

/**
 * Hook to detect current video format based on dimensions
 * Useful for adaptive layouts between YouTube (16:9) and TikTok (9:16)
 */
export function useVideoFormat(): {
  format: VideoFormat;
  isLandscape: boolean;
  isPortrait: boolean;
  isSquare: boolean;
  aspectRatio: number;
} {
  const { width, height } = useVideoConfig();
  const aspectRatio = width / height;

  let format: VideoFormat;
  if (aspectRatio > 1.1) {
    format = "landscape";
  } else if (aspectRatio < 0.9) {
    format = "portrait";
  } else {
    format = "square";
  }

  return {
    format,
    isLandscape: format === "landscape",
    isPortrait: format === "portrait",
    isSquare: format === "square",
    aspectRatio,
  };
}

/**
 * Get responsive value based on video format
 */
export function useResponsiveValue<T>(values: {
  landscape: T;
  portrait: T;
  square?: T;
}): T {
  const { format } = useVideoFormat();

  if (format === "square" && values.square !== undefined) {
    return values.square;
  }

  return format === "landscape" ? values.landscape : values.portrait;
}

/**
 * Get responsive font size
 * Portrait videos typically need smaller text due to narrower width
 */
export function useResponsiveFontSize(baseSizeLandscape: number): number {
  const { isPortrait } = useVideoFormat();
  // Portrait gets ~70% of landscape size
  return isPortrait ? Math.round(baseSizeLandscape * 0.7) : baseSizeLandscape;
}

/**
 * Get responsive spacing
 */
export function useResponsiveSpacing(baseSpacing: number): number {
  const { isPortrait } = useVideoFormat();
  return isPortrait ? Math.round(baseSpacing * 0.6) : baseSpacing;
}
