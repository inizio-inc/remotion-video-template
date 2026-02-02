import { AbsoluteFill } from "remotion";

interface VignetteProps {
  /** Vignette intensity (0-1) */
  intensity?: number;
  /** Vignette color */
  color?: string;
  /** Size of clear center area (0-1, where 0 = full coverage, 1 = no vignette) */
  size?: number;
  /** Softness of the edge (higher = softer) */
  softness?: number;
  children?: React.ReactNode;
}

/**
 * Vignette overlay effect
 * Darkens edges of frame for cinematic look
 */
export const Vignette: React.FC<VignetteProps> = ({
  intensity = 0.6,
  color = "#000000",
  size = 0.3,
  softness = 0.5,
  children,
}) => {
  // Create multiple gradient stops for smoother vignette
  const innerStop = size * 100;
  const outerStop = innerStop + softness * 50;

  const gradient = `radial-gradient(
    ellipse at center,
    transparent ${innerStop}%,
    ${color}${Math.round(intensity * 0.3 * 255).toString(16).padStart(2, "0")} ${(innerStop + outerStop) / 2}%,
    ${color}${Math.round(intensity * 0.7 * 255).toString(16).padStart(2, "0")} ${outerStop}%,
    ${color}${Math.round(intensity * 255).toString(16).padStart(2, "0")} 100%
  )`;

  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill
        style={{
          background: gradient,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
