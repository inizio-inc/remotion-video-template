import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import { makeTransform, scale, translateY } from '@remotion/animation-utils';

const { fontFamily } = loadFont();

interface ContentSceneProps {
  title?: string;
  points?: string[];
  backgroundColor?: string;
  accentColor?: string;
}

/**
 * Content Scene - Main content with animated bullet points
 * Perfect for educational Reels/TikTok
 */
export const ContentScene: React.FC<ContentSceneProps> = ({
  title = "3 Tips You Need",
  points = [
    "First, start with a hook",
    "Then, deliver value fast",
    "Finally, end with CTA",
  ],
  backgroundColor = "#0f0f1a",
  accentColor = "#00ff88",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleEntrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        padding: 60,
        justifyContent: 'center',
      }}
    >
      {/* Title */}
      <div
        style={{
          fontFamily,
          fontSize: 56,
          fontWeight: 800,
          color: 'white',
          marginBottom: 60,
          transform: makeTransform([
            scale(titleEntrance),
            translateY((1 - titleEntrance) * -50),
          ]),
          opacity: titleEntrance,
        }}
      >
        {title}
      </div>

      {/* Bullet points */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {points.map((point, index) => (
          <Sequence key={index} from={20 + index * 25}>
            <BulletPoint
              number={index + 1}
              text={point}
              accentColor={accentColor}
            />
          </Sequence>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const BulletPoint: React.FC<{
  number: number;
  text: string;
  accentColor: string;
}> = ({ number, text, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        transform: makeTransform([
          translateY((1 - entrance) * 40),
        ]),
        opacity: entrance,
      }}
    >
      {/* Number badge */}
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: accentColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
          fontSize: 24,
          fontWeight: 800,
          color: '#0f0f1a',
          flexShrink: 0,
        }}
      >
        {number}
      </div>

      {/* Text */}
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 28,
          fontWeight: 500,
          color: 'white',
        }}
      >
        {text}
      </div>
    </div>
  );
};
