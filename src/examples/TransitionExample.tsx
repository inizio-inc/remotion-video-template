import { AbsoluteFill, Sequence } from 'remotion';
import { SlideTransition } from '../components/transitions/SlideTransition';
import { FadeTransition } from '../components/transitions/FadeTransition';
import { SceneOne } from './SceneOne';
import { SceneTwo } from './SceneTwo';
import { SceneThree } from './SceneThree';

/**
 * Example composition showing transitions between scenes
 * Uses custom transition components from src/components/transitions
 * 
 * To use: Add this composition to Root.tsx
 */
export const TransitionExample: React.FC = () => {
  const scene1Duration = 90; // 3 seconds at 30fps
  const scene2Duration = 90;
  const scene3Duration = 90;

  return (
    <AbsoluteFill>
      {/* Scene 1 with slide-in */}
      <Sequence durationInFrames={scene1Duration}>
        <SlideTransition direction="right" durationInFrames={20}>
          <SceneOne />
        </SlideTransition>
      </Sequence>

      {/* Scene 2 with slide-in */}
      <Sequence from={scene1Duration} durationInFrames={scene2Duration}>
        <SlideTransition direction="left" durationInFrames={20}>
          <SceneTwo />
        </SlideTransition>
      </Sequence>

      {/* Scene 3 with fade-in */}
      <Sequence from={scene1Duration + scene2Duration} durationInFrames={scene3Duration}>
        <FadeTransition durationInFrames={15}>
          <SceneThree />
        </FadeTransition>
      </Sequence>
    </AbsoluteFill>
  );
};
