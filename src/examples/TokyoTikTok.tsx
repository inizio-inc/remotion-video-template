import { AbsoluteFill, Audio, staticFile, OffthreadVideo, interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { TransitionSeries, linearTiming, TransitionPresentation } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { TikTokPage } from '@remotion/captions';
import { SubtitlePage } from '../components/captions';
import { ColorGrading, type ColorGradingMode } from '../components/effects';
import { TOKYO_MANIFEST, type Scene } from './samples';

// Color grading mode for the entire video
// Available: 'none' | 'cinematic' | 'vintage' | 'cold' | 'warm' | 'highContrast' |
//            'moody' | 'vibrant' | 'desaturated' | 'noir' | 'tealOrange' | 'golden' | 'matrix'
const COLOR_GRADE: ColorGradingMode = 'warm';

/**
 * CAPTIONS USAGE:
 *
 * To use animated captions with timeline data:
 * 1. Import SubtitlePage from '../components/captions'
 * 2. Convert your timeline text to TikTokPage format using createTikTokPage()
 * 3. Pass the page to SubtitlePage with desired captionMode: "word" | "phrase" | "character"
 *
 * The timeline.text array in video-manifest.json provides timing data (startMs, endMs, text).
 * For per-scene usage, convert scene duration to ms and create word tokens automatically.
 *
 * Modes:
 * - "word": Shows only current word (TikTok style, big bouncing text)
 * - "phrase": Shows full phrase with current word highlighted
 * - "character": Shows full phrase with character-by-character highlight
 */

/**
 * Creates a TikTokPage from scene data for use with SubtitlePage/CaptionRenderer.
 * Automatically splits text into word tokens with proportional timing.
 *
 * @param text - The caption text
 * @param durationMs - Total duration in milliseconds
 * @returns TikTokPage compatible with @remotion/captions
 */
function createTikTokPage(text: string, durationMs: number): TikTokPage {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const totalChars = words.reduce((sum, w) => sum + w.length, 0);

  let currentMs = 0;
  const tokens = words.map(word => {
    // Distribute time proportionally based on word length
    const wordDuration = (word.length / totalChars) * durationMs;
    const token = {
      text: word,
      fromMs: currentMs,
      toMs: currentMs + wordDuration,
    };
    currentMs += wordDuration;
    return token;
  });

  return {
    startMs: 0,
    endMs: durationMs,
    durationMs,
    text,
    tokens,
  } as TikTokPage;
}

const TRANSITION_FRAMES = 15;

const SCENE_VIDEOS = [
  'samples/tokyo/videos/scene-01.mp4',
  'samples/tokyo/videos/scene-02.mp4',
  'samples/tokyo/videos/scene-03.mp4',
  'samples/tokyo/videos/scene-04.mp4',
  'samples/tokyo/videos/scene-05.mp4',
  'samples/tokyo/videos/scene-06.mp4',
  'samples/tokyo/videos/scene-07.mp4',
];

const TRANSITIONS: TransitionPresentation<Record<string, unknown>>[] = [
  fade(),
  slide({ direction: 'from-bottom' }),
  wipe({ direction: 'from-bottom-left' }),
  fade(),
  slide({ direction: 'from-top' }),
  wipe({ direction: 'from-right' }),
];

export const TokyoTikTok: React.FC = () => {
  const scenes = TOKYO_MANIFEST.scenes;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Audio
        src={staticFile(TOKYO_MANIFEST.music.path)}
        volume={0.15}
      />

      {/*
        IMPORTANT: TransitionSeries.Transition must be placed BETWEEN sequences as siblings,
        NOT inside them. Using flatMap to generate [Sequence, Transition, Sequence, Transition, ...]

        WRONG (transitions won't work):
          <TransitionSeries.Sequence>
            <Scene />
            <TransitionSeries.Transition />  // Inside - doesn't work!
          </TransitionSeries.Sequence>

        CORRECT:
          <TransitionSeries.Sequence><Scene1 /></TransitionSeries.Sequence>
          <TransitionSeries.Transition />  // Between - works!
          <TransitionSeries.Sequence><Scene2 /></TransitionSeries.Sequence>
      */}
      <TransitionSeries>
        {scenes.flatMap((scene, index) => {
          const elements = [
            <TransitionSeries.Sequence
              key={`scene-${scene.id}`}
              durationInFrames={scene.durationInFrames}
            >
              <TokyoScene
                scene={scene}
                videoSrc={SCENE_VIDEOS[index]}
                isFirstScene={index === 0}
                isLastScene={index === scenes.length - 1}
              />
            </TransitionSeries.Sequence>,
          ];

          // Add transition AFTER each scene (except the last one)
          if (index < scenes.length - 1) {
            elements.push(
              <TransitionSeries.Transition
                key={`transition-${index}`}
                presentation={TRANSITIONS[index % TRANSITIONS.length]}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            );
          }

          return elements;
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

// Audio fade timing constants
const AUDIO_FADE_IN_FRAMES = 8;   // Quick fade in at scene start
const AUDIO_FADE_OUT_FRAMES = 25; // Start fading out earlier for smoother transition

const TokyoScene: React.FC<{
  scene: Scene;
  videoSrc: string;
  isFirstScene?: boolean;
  isLastScene?: boolean;
}> = ({ scene, videoSrc, isFirstScene = false, isLastScene = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Ken Burns zoom effect
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.12], { extrapolateRight: 'clamp' });

  /**
   * AUDIO CROSSFADE STRATEGY:
   * During TransitionSeries transitions, BOTH scenes render simultaneously.
   * To avoid voiceover overlap, we use crossfade:
   *
   * 1. Fade IN: Quick fade in over first 8 frames (except first scene)
   * 2. Fade OUT: Start fading 25 frames before end (except last scene)
   * 3. Use easeOut for natural sound decay
   *
   * Timeline example (60 frame scene, 15 frame transition):
   * [0-8]: fade in 0->1
   * [8-35]: full volume (1)
   * [35-60]: fade out 1->0 (overlaps with next scene's fade in)
   */

  // Fade in (skip for first scene - no previous audio to crossfade with)
  const fadeIn = isFirstScene ? 1 : interpolate(
    frame,
    [0, AUDIO_FADE_IN_FRAMES],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }
  );

  // Fade out (skip for last scene - no next audio to crossfade with)
  const fadeOut = isLastScene ? 1 : interpolate(
    frame,
    [durationInFrames - AUDIO_FADE_OUT_FRAMES, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) }
  );

  // Combine: use minimum of both (both must allow full volume for it to be full)
  const audioVolume = fadeIn * fadeOut;

  // Caption opacity - fade out captions during transitions to avoid overlap
  // Captions from both scenes would otherwise render on top of each other
  const captionOpacity = isLastScene ? 1 : interpolate(
    frame,
    [durationInFrames - TRANSITION_FRAMES, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Convert scene duration to ms for caption timing
  const durationMs = (durationInFrames / fps) * 1000;
  const captionPage = createTikTokPage(scene.text, durationMs);

  return (
    <AbsoluteFill>
      {/*
        ColorGrading wraps ONLY the video content, NOT the captions.
        This keeps text readable while applying cinematic color grading to footage.
      */}
      <ColorGrading mode={COLOR_GRADE}>
        <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
          <OffthreadVideo
            src={staticFile(videoSrc)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            muted
          />
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            background: `linear-gradient(
              to top,
              rgba(0,0,0,0.85) 0%,
              rgba(0,0,0,0.4) 35%,
              rgba(0,0,0,0.1) 60%,
              rgba(0,0,0,0.3) 100%
            )`,
          }}
        />
      </ColorGrading>

      {/* Captions are OUTSIDE ColorGrading to remain unaffected */}
      <AbsoluteFill style={{ opacity: captionOpacity }}>
        <SubtitlePage
          page={captionPage}
          captionMode="phrase"
          highlightColor="#FFFF00"
        />
      </AbsoluteFill>

      <Audio src={staticFile(scene.audioPath)} volume={audioVolume} />
    </AbsoluteFill>
  );
};

// IMPORTANT: TransitionSeries transitions OVERLAP scenes, they don't add time.
// With 7 scenes and 6 transitions of 15 frames each, we SUBTRACT the overlap.
// Formula: totalSceneDuration - (transitionFrames * numberOfTransitions)
export const TOKYO_TIKTOK_DURATION = TOKYO_MANIFEST.totalDurationInFrames - (TRANSITION_FRAMES * 6);
