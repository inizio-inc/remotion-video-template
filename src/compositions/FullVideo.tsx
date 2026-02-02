import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import type { ResolvedEDLv1 } from "../types";
import { Scene } from "../components/Scene";
import { getCaptionMode, getFps, getSceneDurationInFrames } from "../utils/edl";

export const FullVideo: React.FC<ResolvedEDLv1> = (edl) => {
  const fps = getFps(edl);
  const captionMode = getCaptionMode(edl);

  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0E0E10" }}>
      {edl.music?.src ? (
        <Audio src={staticFile(edl.music.src)} volume={edl.music.volume ?? 0.25} />
      ) : null}

      {edl.scenes.map((scene) => {
        const durationInFrames = getSceneDurationInFrames(scene, fps);
        const from = currentFrame;
        currentFrame += durationInFrames;

        return (
          <Sequence key={scene.id} from={from} durationInFrames={durationInFrames}>
            <Scene
              scene={scene}
              fps={fps}
              durationInFrames={durationInFrames}
              captionMode={captionMode}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
