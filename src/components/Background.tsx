import { AbsoluteFill, Img, OffthreadVideo, interpolate, useCurrentFrame } from "remotion";
import type { ResolvedEDLv1 } from "../types";

interface BackgroundProps {
  background: ResolvedEDLv1["scenes"][number]["background"];
  fps: number;
  durationInFrames: number;
}

export const Background: React.FC<BackgroundProps> = ({ background, fps, durationInFrames }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, durationInFrames], [1.06, 1.12]);

  if (background.type === "video") {
    const startFrom = Math.max(0, Math.round((background.trimInSec || 0) * fps));
    const endAt = background.trimOutSec ? Math.max(startFrom + 1, Math.round(background.trimOutSec * fps)) : undefined;

    return (
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <OffthreadVideo
          src={background.src}
          startFrom={startFrom}
          endAt={endAt}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          muted
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
      <Img
        src={background.src}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};
