import { AbsoluteFill, Sequence } from 'remotion';
import { FadeTransition } from '../components/transitions/FadeTransition';
import { SlideTransition } from '../components/transitions/SlideTransition';

// Regular scenes
import { IntroScene } from './IntroScene';
import { HookScene as RegularHookScene } from './HookScene';
import { ContentScene as RegularContentScene } from './ContentScene';

// Reels scenes
import { HookScene as ReelsHook } from './reels/HookScene';
import { ContentScene as ReelsContent } from './reels/ContentScene';
import { CTAScene as ReelsCTA } from './reels/CTAScene';

const SECTION_DURATION = 90; // 3 seconds per section
const TRANSITION_DURATION = 15;

/**
 * Showcase - Demonstrates all example scenes
 * Shows both regular (16:9) and reels (9:16) style scenes
 */
export const Showcase: React.FC = () => {
  const sections = [
    // Regular Examples
    {
      title: 'Regular - Intro',
      component: <IntroScene />,
      transition: 'fade' as const,
    },
    {
      title: 'Regular - Hook',
      component: <RegularHookScene />,
      transition: 'slide' as const,
    },
    {
      title: 'Regular - Content',
      component: <RegularContentScene />,
      transition: 'slide' as const,
    },
    // Reels Examples
    {
      title: 'Reels - Hook',
      component: (
        <ReelsHook
          text="WAIT..."
          subtext="You need to see this"
          accentColor="#ff0050"
        />
      ),
      transition: 'fade' as const,
    },
    {
      title: 'Reels - Content',
      component: (
        <ReelsContent
          title="3 Key Points"
          points={[
            "Hook your audience fast",
            "Deliver value quickly",
            "End with strong CTA",
          ]}
          accentColor="#00ff88"
        />
      ),
      transition: 'slide' as const,
    },
    {
      title: 'Reels - CTA',
      component: (
        <ReelsCTA
          mainText="FOLLOW"
          ctaText="for more content"
          handle="@showcase"
          accentColor="#ff0050"
        />
      ),
      transition: 'fade' as const,
    },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {sections.map((section, index) => {
        const from = index * SECTION_DURATION;
        const TransitionWrapper = section.transition === 'fade' ? FadeTransition : SlideTransition;

        return (
          <Sequence key={index} from={from} durationInFrames={SECTION_DURATION}>
            <TransitionWrapper durationInFrames={TRANSITION_DURATION}>
              <AbsoluteFill>
                {section.component}
                {/* Section label */}
                <div
                  style={{
                    position: 'absolute',
                    top: 20,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: '#fff',
                      backgroundColor: 'rgba(99, 102, 241, 0.8)',
                      padding: '8px 20px',
                      borderRadius: 6,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {section.title}
                  </span>
                </div>
              </AbsoluteFill>
            </TransitionWrapper>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// Total duration: 6 sections × 90 frames = 540 frames (18 seconds)
export const SHOWCASE_DURATION = 6 * SECTION_DURATION;
