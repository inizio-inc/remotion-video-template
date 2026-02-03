/**
 * EXAMPLES INDEX
 *
 * This module exports all example scenes and compositions.
 *
 * ANIMATED CAPTIONS (TikTok-style):
 * ---------------------------------
 * To use animated captions with your videos:
 *
 * 1. Import SubtitlePage from '../components/captions'
 * 2. Your video manifest should have timeline.text[] with {startMs, endMs, text}
 * 3. Convert to TikTokPage format (see TokyoTikTok.tsx for createTikTokPage helper)
 * 4. Use SubtitlePage with captionMode: "word" | "phrase" | "character"
 *
 * Example:
 *   const page = createTikTokPage(scene.text, durationMs);
 *   <SubtitlePage page={page} captionMode="word" highlightColor="#FFFF00" />
 *
 * Modes:
 * - "word": Shows only current word, big bouncing TikTok-style
 * - "phrase": Shows full phrase with current word highlighted
 * - "character": Shows full phrase with character-by-character highlight
 *
 * See TokyoTikTok.tsx for full implementation example.
 */

// Regular scenes (16:9 landscape)
export { IntroScene } from './IntroScene';
export { HookScene } from './HookScene';
export { ContentScene } from './ContentScene';
export { TransitionExample } from './TransitionExample';

// Reels/TikTok scenes (9:16 portrait)
export * from './reels';

// Tokyo showcase videos
// TokyoTikTok uses SubtitlePage for animated captions - see file for usage example
export { TokyoLandscape, TOKYO_LANDSCAPE_DURATION } from './TokyoLandscape';
export { TokyoTikTok, TOKYO_TIKTOK_DURATION } from './TokyoTikTok';

// Sample data (Tokyo video)
export * from './samples';
