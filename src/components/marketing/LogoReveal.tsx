import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";

interface LogoRevealProps {
  /** Logo image URL */
  src: string;
  /** Logo width */
  width?: number;
  /** Reveal animation style */
  animation?: "fade" | "scale" | "blur" | "slide" | "bounce" | "flip" | "glitch" | "shine";
  /** Entrance delay */
  delay?: number;
  /** Glow color (optional) */
  glowColor?: string;
  /** Glow intensity */
  glowIntensity?: number;
  /** Add floating animation after reveal */
  float?: boolean;
  /** Add shine sweep effect */
  shine?: boolean;
  /** Tagline text below logo */
  tagline?: string;
  /** Tagline delay (additional frames after logo) */
  taglineDelay?: number;
}

/**
 * Cinematic logo reveal animations.
 * Multiple animation styles for professional brand intros.
 */
export const LogoReveal: React.FC<LogoRevealProps> = ({
  src,
  width = 300,
  animation = "scale",
  delay = 0,
  glowColor,
  glowIntensity = 0.5,
  float = false,
  shine = false,
  tagline,
  taglineDelay = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  // Main entrance spring
  const entrance = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Bounce spring (more elastic)
  const bounceEntrance = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 8, stiffness: 150 },
  });

  // Tagline entrance
  const taglineEntrance = spring({
    frame: Math.max(0, adjustedFrame - taglineDelay),
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  // Floating animation
  const floatY = float ? Math.sin(adjustedFrame * 0.04) * 8 : 0;
  const floatRotate = float ? Math.sin(adjustedFrame * 0.03) * 1 : 0;

  // Shine position
  const shineX = shine ? ((adjustedFrame * 4) % (width * 2)) - width * 0.5 : -width;

  // Get animation styles
  const getAnimationStyles = () => {
    switch (animation) {
      case "fade":
        return {
          opacity: entrance,
          transform: `translateY(${floatY}px) rotate(${floatRotate}deg)`,
          filter: "none",
        };

      case "scale":
        return {
          opacity: entrance,
          transform: `scale(${interpolate(entrance, [0, 1], [0.5, 1])}) translateY(${floatY}px) rotate(${floatRotate}deg)`,
          filter: "none",
        };

      case "blur":
        return {
          opacity: entrance,
          transform: `scale(${interpolate(entrance, [0, 1], [1.1, 1])}) translateY(${floatY}px)`,
          filter: `blur(${interpolate(entrance, [0, 1], [20, 0])}px)`,
        };

      case "slide":
        return {
          opacity: entrance,
          transform: `translateY(${interpolate(entrance, [0, 1], [50, 0]) + floatY}px) rotate(${floatRotate}deg)`,
          filter: "none",
        };

      case "bounce":
        return {
          opacity: Math.min(bounceEntrance * 2, 1),
          transform: `scale(${interpolate(bounceEntrance, [0, 1], [0, 1])}) translateY(${floatY}px)`,
          filter: "none",
        };

      case "flip":
        return {
          opacity: entrance,
          transform: `perspective(1000px) rotateY(${interpolate(entrance, [0, 1], [90, 0])}deg) translateY(${floatY}px)`,
          filter: "none",
        };

      case "glitch": {
        const glitchOffset = adjustedFrame < 15 ? Math.sin(adjustedFrame * 2) * 5 : 0;
        const glitchSkew = adjustedFrame < 15 ? Math.sin(adjustedFrame * 3) * 2 : 0;
        return {
          opacity: entrance,
          transform: `translateX(${glitchOffset}px) skewX(${glitchSkew}deg) translateY(${floatY}px)`,
          filter: adjustedFrame < 15 ? `hue-rotate(${Math.sin(adjustedFrame) * 30}deg)` : "none",
        };
      }

      case "shine":
        return {
          opacity: entrance,
          transform: `scale(${interpolate(entrance, [0, 1], [0.9, 1])}) translateY(${floatY}px)`,
          filter: "none",
        };

      default:
        return {
          opacity: 1,
          transform: `translateY(${floatY}px)`,
          filter: "none",
        };
    }
  };

  const animStyles = getAnimationStyles();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* Logo container */}
        <div
          style={{
            position: "relative",
            ...animStyles,
          }}
        >
          {/* Glow layer */}
          {glowColor && (
            <div
              style={{
                position: "absolute",
                inset: -20,
                background: `radial-gradient(circle, ${glowColor}${Math.round(glowIntensity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
                filter: `blur(${30 * glowIntensity}px)`,
                opacity: entrance,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Logo */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            <Img
              src={src}
              style={{
                width,
                height: "auto",
                objectFit: "contain",
              }}
            />

            {/* Shine sweep */}
            {(shine || animation === "shine") && entrance > 0.8 && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: shineX,
                  width: width * 0.3,
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  transform: "skewX(-20deg)",
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        </div>

        {/* Tagline */}
        {tagline && (
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: "rgba(255,255,255,0.8)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: taglineEntrance,
              transform: `translateY(${interpolate(taglineEntrance, [0, 1], [20, 0])}px)`,
            }}
          >
            {tagline}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Text logo reveal (for text-based logos)
 */
export const TextLogoReveal: React.FC<{
  text: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  animation?: "typewriter" | "stagger" | "blur" | "slide";
  delay?: number;
  glowColor?: string;
}> = ({
  text,
  fontSize = 72,
  fontWeight = 700,
  color = "#ffffff",
  animation = "stagger",
  delay = 0,
  glowColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const chars = text.split("");

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          filter: glowColor ? `drop-shadow(0 0 20px ${glowColor})` : undefined,
        }}
      >
        {chars.map((char, index) => {
          const charDelay = animation === "typewriter" ? index * 2 : index * 3;
          const charFrame = Math.max(0, adjustedFrame - charDelay);

          const charEntrance = spring({
            frame: charFrame,
            fps,
            config: { damping: 15, stiffness: 150 },
          });

          let charStyle: React.CSSProperties = {
            fontSize,
            fontWeight,
            color,
            display: "inline-block",
          };

          switch (animation) {
            case "typewriter":
              charStyle.opacity = charEntrance > 0.1 ? 1 : 0;
              break;
            case "stagger":
              charStyle.opacity = charEntrance;
              charStyle.transform = `translateY(${interpolate(charEntrance, [0, 1], [30, 0])}px)`;
              break;
            case "blur":
              charStyle.opacity = charEntrance;
              charStyle.filter = `blur(${interpolate(charEntrance, [0, 1], [10, 0])}px)`;
              break;
            case "slide":
              charStyle.opacity = charEntrance;
              charStyle.transform = `translateX(${interpolate(charEntrance, [0, 1], [-20, 0])}px)`;
              break;
          }

          return (
            <span key={index} style={charStyle}>
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
