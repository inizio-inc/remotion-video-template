import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useMemo } from "react";

interface GrainOverlayProps {
  /** Grain intensity (0-1) */
  intensity?: number;
  /** Animate grain */
  animate?: boolean;
  /** Grain size in pixels */
  size?: number;
  children?: React.ReactNode;
}

/**
 * Film grain overlay effect
 * Adds texture and vintage feel
 */
export const GrainOverlay: React.FC<GrainOverlayProps> = ({
  intensity = 0.15,
  animate = true,
  size = 100,
  children,
}) => {
  const frame = useCurrentFrame();

  // Generate grain pattern with noise
  const grainSvg = useMemo(() => {
    const seed = animate ? frame : 0;
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
        <filter id="grain-${seed}">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" seed="${seed}" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-${seed})"/>
      </svg>
    `;
  }, [frame, animate, size]);

  const encodedSvg = `data:image/svg+xml,${encodeURIComponent(grainSvg)}`;

  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill
        style={{
          // eslint-disable-next-line @remotion/no-background-image
          backgroundImage: `url("${encodedSvg}")`,
          backgroundRepeat: "repeat",
          opacity: intensity,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
