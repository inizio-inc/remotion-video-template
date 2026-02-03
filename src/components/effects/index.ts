/**
 * VISUAL EFFECTS COMPONENTS
 *
 * Reusable effects for video compositions.
 *
 * ## ColorGrading
 *
 * Applies cinematic color grading. Wrap video content, keep text OUTSIDE.
 *
 * ```tsx
 * import { ColorGrading } from '../components/effects';
 *
 * <ColorGrading mode="warm">
 *   <Video />
 * </ColorGrading>
 * <Captions /> // Outside - not affected
 * ```
 *
 * Modes: 'none' | 'cinematic' | 'vintage' | 'cold' | 'warm' | 'highContrast' |
 *        'moody' | 'vibrant' | 'desaturated' | 'noir' | 'tealOrange' | 'golden' | 'matrix'
 *
 * ## Vignette
 *
 * Darkens edges of frame for cinematic look.
 *
 * ```tsx
 * <Vignette intensity={0.5} size={0.4}>
 *   <Content />
 * </Vignette>
 * ```
 *
 * ## GrainOverlay
 *
 * Adds film grain texture.
 *
 * ```tsx
 * <GrainOverlay intensity={0.05}>
 *   <Content />
 * </GrainOverlay>
 * ```
 *
 * ## VideoBackground
 *
 * Full-screen video with Ken Burns effect.
 */
export { Vignette } from './Vignette';
export { GrainOverlay } from './GrainOverlay';
export { VideoBackground } from './VideoBackground';
export { ColorGrading, colorGradingPresets, type ColorGradingMode } from './ColorGrading';
