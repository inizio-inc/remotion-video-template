import React from 'react';
import { AbsoluteFill } from 'remotion';

/**
 * Color Grading Component
 *
 * Applies cinematic color grading to video content.
 * Wrap your video/image content with this component, but keep captions OUTSIDE
 * to avoid color grading affecting text readability.
 *
 * Usage:
 *   <ColorGrading mode="cinematic">
 *     <OffthreadVideo ... />
 *   </ColorGrading>
 *   <Captions /> // Outside - not affected by color grading
 *
 * Available modes:
 * - "none": No color grading
 * - "cinematic": Teal shadows + orange highlights (Hollywood look)
 * - "vintage": Warm, faded retro look
 * - "cold": Blue/teal tint, desaturated (Nordic noir)
 * - "warm": Golden hour warmth
 * - "highContrast": Punchy blacks and whites
 * - "moody": Crushed blacks, muted colors
 * - "vibrant": Boosted saturation
 * - "desaturated": Partially desaturated, muted
 * - "noir": Black and white with high contrast
 * - "tealOrange": Strong teal/orange split toning
 * - "golden": Warm golden tones
 * - "matrix": Green tint (cyberpunk/Matrix style)
 */

export type ColorGradingMode =
  | 'none'
  | 'cinematic'
  | 'vintage'
  | 'cold'
  | 'warm'
  | 'highContrast'
  | 'moody'
  | 'vibrant'
  | 'desaturated'
  | 'noir'
  | 'tealOrange'
  | 'golden'
  | 'matrix';

interface ColorGradingProps {
  mode: ColorGradingMode;
  intensity?: number; // 0-1, default 1
  children: React.ReactNode;
}

// CSS filter presets for each mode
const filterPresets: Record<ColorGradingMode, string> = {
  none: 'none',
  cinematic: 'contrast(1.1) saturate(1.15) brightness(0.95)',
  vintage: 'sepia(0.3) contrast(1.1) brightness(1.05) saturate(0.85)',
  cold: 'saturate(0.8) brightness(1.05) contrast(1.1) hue-rotate(-10deg)',
  warm: 'sepia(0.2) saturate(1.2) brightness(1.05) contrast(1.05)',
  highContrast: 'contrast(1.3) saturate(1.1) brightness(0.95)',
  moody: 'contrast(1.15) brightness(0.85) saturate(0.9)',
  vibrant: 'saturate(1.4) contrast(1.1) brightness(1.02)',
  desaturated: 'saturate(0.6) contrast(1.1)',
  noir: 'grayscale(1) contrast(1.3) brightness(0.95)',
  tealOrange: 'contrast(1.15) saturate(1.2) brightness(0.98)',
  golden: 'sepia(0.25) saturate(1.3) brightness(1.08) contrast(1.05)',
  matrix: 'hue-rotate(90deg) saturate(0.8) brightness(0.9) contrast(1.2)',
};

// SVG filter IDs for advanced color grading
const svgFilterIds: Partial<Record<ColorGradingMode, string>> = {
  cinematic: 'colorgrade-cinematic',
  tealOrange: 'colorgrade-teal-orange',
  cold: 'colorgrade-cold',
};

export const ColorGrading: React.FC<ColorGradingProps> = ({
  mode,
  intensity = 1,
  children,
}) => {
  if (mode === 'none' || intensity === 0) {
    return <>{children}</>;
  }

  const cssFilter = filterPresets[mode];
  const svgFilterId = svgFilterIds[mode];

  // For modes with SVG filters, combine both
  const filterStyle = svgFilterId
    ? `url(#${svgFilterId}) ${cssFilter}`
    : cssFilter;

  // Apply intensity by interpolating with 'none'
  const finalFilter = intensity === 1
    ? filterStyle
    : filterStyle; // CSS doesn't support filter interpolation, so we use opacity trick

  return (
    <>
      {/* SVG Filters for advanced color grading */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          {/* Cinematic: Teal shadows, orange highlights */}
          <filter id="colorgrade-cinematic">
            <feColorMatrix
              type="matrix"
              values="
                1.1  0    0    0  0
                0    1.0  0.1  0  0
                0    0.1  1.1  0  0.02
                0    0    0    1  0
              "
            />
          </filter>

          {/* Teal/Orange: Strong split toning */}
          <filter id="colorgrade-teal-orange">
            <feColorMatrix
              type="matrix"
              values="
                1.2  0    0    0  0
                0    1.0  0    0  0
                -0.1 0.1  1.2  0  0.05
                0    0    0    1  0
              "
            />
          </filter>

          {/* Cold: Blue tint in shadows */}
          <filter id="colorgrade-cold">
            <feColorMatrix
              type="matrix"
              values="
                0.95 0    0    0  0
                0    0.95 0.05 0  0
                0    0.05 1.1  0  0.03
                0    0    0    1  0
              "
            />
          </filter>
        </defs>
      </svg>

      <AbsoluteFill
        style={{
          filter: finalFilter,
          opacity: intensity < 1 ? intensity + (1 - intensity) * 0.5 : 1,
        }}
      >
        {children}
      </AbsoluteFill>
    </>
  );
};

// Export preset descriptions for UI/documentation
export const colorGradingPresets: Record<ColorGradingMode, { name: string; description: string }> = {
  none: { name: 'None', description: 'No color grading applied' },
  cinematic: { name: 'Cinematic', description: 'Teal shadows + orange highlights (Hollywood blockbuster look)' },
  vintage: { name: 'Vintage', description: 'Warm, faded retro film look' },
  cold: { name: 'Cold', description: 'Blue/teal tint with desaturation (Nordic noir)' },
  warm: { name: 'Warm', description: 'Golden hour warmth and glow' },
  highContrast: { name: 'High Contrast', description: 'Punchy blacks and bright highlights' },
  moody: { name: 'Moody', description: 'Crushed blacks with muted colors' },
  vibrant: { name: 'Vibrant', description: 'Boosted saturation for pop' },
  desaturated: { name: 'Desaturated', description: 'Muted, documentary-style colors' },
  noir: { name: 'Noir', description: 'Black and white with high contrast' },
  tealOrange: { name: 'Teal & Orange', description: 'Strong complementary split toning' },
  golden: { name: 'Golden', description: 'Rich golden/amber tones' },
  matrix: { name: 'Matrix', description: 'Green cyberpunk tint' },
};

export default ColorGrading;
