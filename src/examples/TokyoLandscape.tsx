import { AbsoluteFill, Audio, staticFile, OffthreadVideo, interpolate, useCurrentFrame, useVideoConfig, Easing, Sequence } from 'remotion';
import { TransitionSeries, linearTiming, TransitionPresentation } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { ColorGrading, type ColorGradingMode } from '../components/effects';
import { Letterbox } from '../components/layouts/Letterbox';
import { TextMask } from '../components/text/TextMask';
import { TOKYO_MANIFEST } from './samples';

/**
 * TOKYO LANDSCAPE - Professional Marketing Video Example
 *
 * Features used:
 * - TextMask: Video plays through text letters (intro scene)
 * - Letterbox: Cinematic 2.35:1 aspect ratio
 * - ColorGrading: Warm color correction
 * - TransitionSeries: Smooth scene transitions
 * - Audio crossfade: Prevents voiceover overlap
 *
 * This demonstrates a premium promo video style suitable for
 * YouTube, social media ads, and brand content.
 */

// === CONFIGURATION ===
const COLOR_GRADE: ColorGradingMode = 'warm';
const LETTERBOX_RATIO = 2.35; // Cinematic widescreen
const TRANSITION_FRAMES = 18;

// Intro scene with TextMask is longer for impact
const INTRO_DURATION_FRAMES = 90; // 3 seconds at 30fps

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
  wipe({ direction: 'from-left' }),
  fade(),
  slide({ direction: 'from-right' }),
  wipe({ direction: 'from-top-left' }),
  fade(),
];

// === MAIN COMPONENT ===
export const TokyoLandscape: React.FC = () => {
  const scenes = TOKYO_MANIFEST.scenes;

  return (
    <Letterbox aspectRatio={LETTERBOX_RATIO} animate animationDuration={20}>
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
        {/* Background music */}
        <Audio
          src={staticFile(TOKYO_MANIFEST.music.path)}
          volume={0.2}
        />

        {/* Intro: TextMask with "TOKYO" - video plays through letters */}
        <Sequence durationInFrames={INTRO_DURATION_FRAMES}>
          <IntroScene videoSrc={SCENE_VIDEOS[0]} audioSrc={scenes[0].audioPath} />
        </Sequence>

        {/* Main content scenes with transitions */}
        <Sequence from={INTRO_DURATION_FRAMES - TRANSITION_FRAMES}>
          <TransitionSeries>
            {scenes.slice(1).flatMap((scene, index) => {
              const elements = [
                <TransitionSeries.Sequence
                  key={`scene-${scene.id}`}
                  durationInFrames={scene.durationInFrames}
                >
                  <ContentScene
                    videoSrc={SCENE_VIDEOS[index + 1]}
                    audioSrc={scene.audioPath}
                    isFirstScene={index === 0}
                    isLastScene={index === scenes.length - 2}
                  />
                </TransitionSeries.Sequence>,
              ];

              if (index < scenes.length - 2) {
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
        </Sequence>
      </AbsoluteFill>
    </Letterbox>
  );
};

// === INTRO SCENE: TextMask ===
const IntroScene: React.FC<{
  videoSrc: string;
  audioSrc: string;
}> = ({ videoSrc, audioSrc }) => {
  const frame = useCurrentFrame();

  // Fade out audio before transition to next scene
  const audioVolume = interpolate(
    frame,
    [0, INTRO_DURATION_FRAMES - 30, INTRO_DURATION_FRAMES],
    [1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill>
      <ColorGrading mode={COLOR_GRADE}>
        <TextMask
          text="TOKYO"
          videoSrc={videoSrc}
          fontWeight={900}
          fontFamily="Inter, -apple-system, sans-serif"
          fillWidth={0.85}
          animate
          delay={10}
          backgroundColor="#0a0a0a"
        />
      </ColorGrading>

      <Audio src={staticFile(audioSrc)} volume={audioVolume} />
    </AbsoluteFill>
  );
};

// === CONTENT SCENE: Regular video with Ken Burns ===
const AUDIO_FADE_IN_FRAMES = 8;
const AUDIO_FADE_OUT_FRAMES = 30;

const ContentScene: React.FC<{
  videoSrc: string;
  audioSrc: string;
  isFirstScene?: boolean;
  isLastScene?: boolean;
}> = ({ videoSrc, audioSrc, isFirstScene = false, isLastScene = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Ken Burns effect
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.1], { extrapolateRight: 'clamp' });
  const panX = interpolate(frame, [0, durationInFrames], [0, -15], { extrapolateRight: 'clamp' });

  // Audio crossfade
  const fadeIn = isFirstScene ? 1 : interpolate(
    frame,
    [0, AUDIO_FADE_IN_FRAMES],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }
  );

  const fadeOut = isLastScene ? 1 : interpolate(
    frame,
    [durationInFrames - AUDIO_FADE_OUT_FRAMES, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) }
  );

  const audioVolume = fadeIn * fadeOut;

  return (
    <AbsoluteFill>
      <ColorGrading mode={COLOR_GRADE}>
        <AbsoluteFill style={{ transform: `scale(${zoom}) translateX(${panX}px)` }}>
          <OffthreadVideo
            src={staticFile(videoSrc)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            muted
          />
        </AbsoluteFill>
      </ColorGrading>

      <Audio src={staticFile(audioSrc)} volume={audioVolume} />
    </AbsoluteFill>
  );
};

// === DURATION CALCULATION ===
// Intro + remaining scenes - transition overlaps
const REMAINING_SCENES_DURATION = TOKYO_MANIFEST.scenes
  .slice(1)
  .reduce((sum, s) => sum + s.durationInFrames, 0);

export const TOKYO_LANDSCAPE_DURATION =
  INTRO_DURATION_FRAMES +
  REMAINING_SCENES_DURATION -
  (TRANSITION_FRAMES * 6); // 6 transitions total
