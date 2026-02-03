import { AbsoluteFill, Sequence } from 'remotion';
import { SlideTransition } from '../components/transitions/SlideTransition';
import { FadeTransition } from '../components/transitions/FadeTransition';
import { IntroScene } from './IntroScene';
import { HookScene } from './HookScene';
import { ContentScene } from './ContentScene';

/**
 * Example composition showing transitions between scenes
 * Uses custom transition components from src/components/transitions
 * 
 * CRITICAL: Shows proper audio sync with transitions to avoid voiceover desync
 * 
 * To use: Add this composition to Root.tsx
 */
export const TransitionExample: React.FC = () => {
  const scene1Duration = 90; // 3 seconds at 30fps
  const scene2Duration = 90;
  const scene3Duration = 90;
  const transitionDuration = 20; // Transition length

  return (
    <AbsoluteFill>
      {/* Scene 1 with slide-in */}
      <Sequence durationInFrames={scene1Duration}>
        <SlideTransition direction="right" durationInFrames={transitionDuration}>
          <IntroScene />
        </SlideTransition>
        
        {/* IMPORTANT: Audio ends BEFORE transition starts to avoid desync */}
        {/* Voiceover plays for 70 frames, leaving 20 frames for transition */}
        {/* Uncomment when you have audio:
        <Audio 
          src={staticFile('audio/scene1.wav')} 
          endAt={scene1Duration - transitionDuration}
        />
        */}
      </Sequence>

      {/* Scene 2 with slide-in */}
      <Sequence from={scene1Duration} durationInFrames={scene2Duration}>
        <SlideTransition direction="left" durationInFrames={transitionDuration}>
          <HookScene />
        </SlideTransition>
        
        {/* Audio for Scene 2: also ends before transition */}
        {/* Uncomment when you have audio:
        <Audio 
          src={staticFile('audio/scene2.wav')} 
          endAt={scene2Duration - transitionDuration}
        />
        */}
      </Sequence>

      {/* Scene 3 with fade-in */}
      <Sequence from={scene1Duration + scene2Duration} durationInFrames={scene3Duration}>
        <FadeTransition durationInFrames={15}>
          <ContentScene />
        </FadeTransition>
        
        {/* Last scene: full duration (no transition after) */}
        {/* Uncomment when you have audio:
        <Audio src={staticFile('audio/scene3.wav')} />
        */}
      </Sequence>
    </AbsoluteFill>
  );
};
