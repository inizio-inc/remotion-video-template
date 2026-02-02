import { AbsoluteFill, staticFile } from "remotion";
import type { VideoPlanV1 } from "../types";
import { Background } from "../components/Background";

export const Thumbnail: React.FC<VideoPlanV1> = (plan) => {
  const firstScene = plan.scenes[0];

  if (!firstScene) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#1B1A1D",
          justifyContent: "center",
          alignItems: "center",
          color: "#FFFFFF",
          fontSize: 64,
          fontWeight: 700,
          fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif",
        }}
      >
        No scenes
      </AbsoluteFill>
    );
  }

  const background = {
    ...firstScene.background,
    src: staticFile(firstScene.background.src),
  };

  return (
    <AbsoluteFill style={{ fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif" }}>
      <Background background={background} fps={30} durationInFrames={1} />
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "6%",
          right: "6%",
          color: "#F9F6F1",
          fontSize: 86,
          fontWeight: 900,
          lineHeight: 1.05,
          textShadow: "0 12px 34px rgba(0,0,0,0.7)",
        }}
      >
        {firstScene.onScreen?.headline || firstScene.name}
      </div>
    </AbsoluteFill>
  );
};
