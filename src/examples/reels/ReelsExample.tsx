import { AbsoluteFill, Sequence } from 'remotion';
import { SlideTransition } from '../../components/transitions/SlideTransition';
import { HookScene } from './HookScene';
import { ContentScene } from './ContentScene';
import { CTAScene } from './CTAScene';

/**
 * Reels/TikTok Example - Complete vertical video
 * Demonstrates hook → content → CTA flow
 *
 * Recommended dimensions: 1080x1920 (9:16)
 * Recommended FPS: 30
 */
export const ReelsExample: React.FC = () => {
  const hookDuration = 60;      // 2 seconds
  const contentDuration = 150;  // 5 seconds
  const ctaDuration = 90;       // 3 seconds
  const transitionDuration = 15;

  return (
    <AbsoluteFill>
      {/* Hook - Grab attention */}
      <Sequence durationInFrames={hookDuration}>
        <SlideTransition direction="up" durationInFrames={transitionDuration}>
          <HookScene
            text="STOP!"
            subtext="This will change everything"
            accentColor="#ff0050"
          />
        </SlideTransition>
      </Sequence>

      {/* Content - Deliver value */}
      <Sequence from={hookDuration} durationInFrames={contentDuration}>
        <SlideTransition direction="left" durationInFrames={transitionDuration}>
          <ContentScene
            title="The Secret Formula"
            points={[
              "Hook them in 1 second",
              "Deliver value immediately",
              "Always end with a CTA",
            ]}
            accentColor="#00ff88"
          />
        </SlideTransition>
      </Sequence>

      {/* CTA - Drive action */}
      <Sequence from={hookDuration + contentDuration} durationInFrames={ctaDuration}>
        <SlideTransition direction="up" durationInFrames={transitionDuration}>
          <CTAScene
            mainText="FOLLOW"
            ctaText="for daily tips"
            handle="@creator"
            accentColor="#ff0050"
          />
        </SlideTransition>
      </Sequence>
    </AbsoluteFill>
  );
};

// Export duration for Root.tsx
export const REELS_EXAMPLE_DURATION = 60 + 150 + 90; // 300 frames = 10 seconds
