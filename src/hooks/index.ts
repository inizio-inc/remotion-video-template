/**
 * REMOTION HOOKS
 *
 * Custom hooks for video effects and animations.
 *
 * ## useBeatSync
 *
 * Syncs visual effects to music beats based on BPM.
 *
 * Usage:
 * ```tsx
 * import { useBeatSync } from '../hooks';
 *
 * const MyScene = () => {
 *   const { beatScale, beatBrightness, onBeat } = useBeatSync({
 *     bpm: 120,           // Beats per minute of your music
 *     offsetMs: 0,        // Offset if music doesn't start on beat
 *     decay: 0.2,         // How fast effect fades (0-1)
 *     scaleAmount: 1.05,  // Zoom pulse amount (1.05 = 5%)
 *     brightnessAmount: 1.15, // Brightness flash amount
 *   });
 *
 *   return (
 *     <AbsoluteFill style={{
 *       transform: `scale(${beatScale})`,
 *       filter: `brightness(${beatBrightness})`,
 *     }}>
 *       <Video />
 *     </AbsoluteFill>
 *   );
 * };
 * ```
 *
 * Returns:
 * - `beatScale`: Scale value for zoom pulse (1.0 to scaleAmount)
 * - `beatBrightness`: Brightness for flash effect (1.0 to brightnessAmount)
 * - `beatIntensity`: Raw intensity 0-1 that spikes on beat
 * - `onBeat`: Boolean, true on exact frame of beat
 * - `beatNumber`: Current beat count
 * - `beatProgress`: Progress within current beat (0-1)
 *
 * Tips:
 * - Use tap tempo tools to find your music's BPM
 * - Start with subtle values (1.03 scale, 1.1 brightness)
 * - Adjust offsetMs if effects feel off-beat
 */
export { useBeatSync, commonBPMs, type BeatSyncOptions, type BeatSyncResult } from './useBeatSync';
