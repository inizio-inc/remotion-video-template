import { AbsoluteFill, Audio, staticFile } from "remotion";
import type { CaptionMode, ResolvedEDLv1 } from "../types";
import { Background } from "./Background";
import { KaraokeCaptions } from "./CaptionsKaraoke";
import { TikTokCaptions } from "./CaptionsTikTok";

interface SceneProps {
  scene: ResolvedEDLv1["scenes"][number];
  fps: number;
  durationInFrames: number;
  captionMode: CaptionMode;
}

export const Scene: React.FC<SceneProps> = ({ scene, fps, durationInFrames, captionMode }) => {
  const background = {
    ...scene.background,
    src: staticFile(scene.background.src),
  };

  return (
    <AbsoluteFill style={{ fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif" }}>
      <Background background={background} fps={fps} durationInFrames={durationInFrames} />
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      <Audio src={staticFile(scene.voSrc)} />

      {scene.onScreen?.headline ? (
        <div
          style={{
            position: "absolute",
            top: "6%",
            left: "6%",
            right: "6%",
            color: "#F9F6F1",
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: -0.5,
            textShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          {scene.onScreen.headline}
        </div>
      ) : null}

      {scene.onScreen?.subtitle ? (
        <div
          style={{
            position: "absolute",
            top: "16%",
            left: "6%",
            right: "6%",
            color: "#E8E1D6",
            fontSize: 36,
            fontWeight: 600,
            textShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          {scene.onScreen.subtitle}
        </div>
      ) : null}

      {captionMode === "karaoke" ? (
        <KaraokeCaptions text={scene.onScreen?.headline || scene.name} timestamps={scene.timestamps} fps={fps} />
      ) : null}

      {captionMode === "tiktok" ? (
        <TikTokCaptions text={scene.onScreen?.headline || scene.name} timestamps={scene.timestamps} fps={fps} />
      ) : null}
    </AbsoluteFill>
  );
};
