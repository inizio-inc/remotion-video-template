import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import type { VideoPlanV1 } from "../types";
import { Scene } from "../components/Scene";
import { getCaptionMode, getFps, getSceneDurationInFrames } from "../utils/plan";

export const Audiogram: React.FC<VideoPlanV1> = (plan) => {
  const fps = getFps(plan);
  const captionMode = getCaptionMode(plan);

  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0E0E10" }}>
      {plan.music?.src ? (
        <Audio src={staticFile(plan.music.src)} volume={plan.music.volume ?? 0.2} />
      ) : null}

      {plan.scenes.map((scene) => {
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
