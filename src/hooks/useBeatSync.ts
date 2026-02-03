import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

/**
 * Beat Sync Hook
 *
 * Provides beat-synchronized values for visual effects.
 * Uses BPM (beats per minute) to calculate beat positions.
 *
 * Usage:
 *   const { beatProgress, onBeat, beatIntensity, beatScale, beatBrightness } = useBeatSync({
 *     bpm: 120,
 *     offsetMs: 0, // adjust if music doesn't start on beat
 *   });
 *
 *   // Use beatScale for zoom pulse effect
 *   <div style={{ transform: `scale(${beatScale})` }} />
 *
 *   // Use beatBrightness for flash effect
 *   <div style={{ filter: `brightness(${beatBrightness})` }} />
 */

export interface BeatSyncOptions {
  /** Beats per minute of the music */
  bpm: number;
  /** Offset in milliseconds if music doesn't start exactly on a beat */
  offsetMs?: number;
  /** How quickly the beat effect decays (0-1, default 0.15) */
  decay?: number;
  /** Scale multiplier on beat (default 1.05 = 5% zoom) */
  scaleAmount?: number;
  /** Brightness boost on beat (default 1.15 = 15% brighter) */
  brightnessAmount?: number;
}

export interface BeatSyncResult {
  /** Current beat number (0-indexed) */
  beatNumber: number;
  /** Progress within current beat (0-1) */
  beatProgress: number;
  /** True on the exact frame of a beat */
  onBeat: boolean;
  /** Intensity value that spikes on beat and decays (0-1) */
  beatIntensity: number;
  /** Scale value for zoom pulse (1.0 to scaleAmount) */
  beatScale: number;
  /** Brightness value for flash effect (1.0 to brightnessAmount) */
  beatBrightness: number;
  /** Time in ms since last beat */
  timeSinceLastBeat: number;
  /** Time in ms until next beat */
  timeUntilNextBeat: number;
}

export function useBeatSync(options: BeatSyncOptions): BeatSyncResult {
  const { bpm, offsetMs = 0, decay = 0.15, scaleAmount = 1.05, brightnessAmount = 1.2 } = options;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate timing
  const currentTimeMs = (frame / fps) * 1000 - offsetMs;
  const beatDurationMs = (60 / bpm) * 1000; // Duration of one beat in ms
  const beatDurationFrames = (60 / bpm) * fps; // Duration of one beat in frames

  // Current beat number and progress
  const exactBeat = currentTimeMs / beatDurationMs;
  const beatNumber = Math.floor(exactBeat);
  const beatProgress = exactBeat - beatNumber;

  // Time since/until beat
  const timeSinceLastBeat = beatProgress * beatDurationMs;
  const timeUntilNextBeat = (1 - beatProgress) * beatDurationMs;

  // Check if we're on a beat (within first frame of beat)
  const frameInBeat = (frame % beatDurationFrames);
  const onBeat = frameInBeat < 1;

  // Beat intensity - spikes to 1 on beat, decays exponentially
  // Using decay parameter to control how fast it fades
  const beatIntensity = interpolate(
    beatProgress,
    [0, decay, 1],
    [1, 0.1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }
  );

  // Scale pulse - goes from scaleAmount back to 1
  const beatScale = interpolate(
    beatIntensity,
    [0, 1],
    [1, scaleAmount]
  );

  // Brightness flash - goes from brightnessAmount back to 1
  const beatBrightness = interpolate(
    beatIntensity,
    [0, 1],
    [1, brightnessAmount]
  );

  return {
    beatNumber,
    beatProgress,
    onBeat,
    beatIntensity,
    beatScale,
    beatBrightness,
    timeSinceLastBeat,
    timeUntilNextBeat,
  };
}

/**
 * Helper to detect BPM from common music tempos
 * Most background music for videos is in the 90-130 BPM range
 */
export const commonBPMs = {
  slow: 80,
  relaxed: 95,
  moderate: 110,
  upbeat: 120,
  energetic: 130,
  fast: 140,
} as const;

export default useBeatSync;
