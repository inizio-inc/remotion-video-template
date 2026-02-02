import { Composition } from "remotion";
import { FullVideo } from "./compositions/FullVideo";
import { TikTokVideo } from "./compositions/TikTokVideo";
import { Audiogram } from "./compositions/Audiogram";
import { Thumbnail } from "./compositions/Thumbnail";
import type { ResolvedEDLv1 } from "./types";
import { getTotalDurationInFrames } from "./utils/edl";

const DEFAULT_EDL: ResolvedEDLv1 = {
  schemaVersion: "resolved-edl.v1",
  format: { width: 1920, height: 1080, fps: 30 },
  captions: { mode: "none" },
  scenes: [],
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FullVideo"
        component={FullVideo}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={DEFAULT_EDL}
        calculateMetadata={({ props }) => {
          const edl = props as ResolvedEDLv1;
          const durationInFrames = getTotalDurationInFrames(edl);
          return {
            durationInFrames,
            fps: edl.format?.fps || 30,
            width: 1920,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TikTokVideo"
        component={TikTokVideo}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...DEFAULT_EDL,
          format: { width: 1080, height: 1920, fps: 30 },
        }}
        calculateMetadata={({ props }) => {
          const edl = props as ResolvedEDLv1;
          const durationInFrames = getTotalDurationInFrames(edl);
          return {
            durationInFrames,
            fps: edl.format?.fps || 30,
            width: 1080,
            height: 1920,
          };
        }}
      />
      <Composition
        id="Audiogram"
        component={Audiogram}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          ...DEFAULT_EDL,
          format: { width: 1080, height: 1080, fps: 30 },
        }}
        calculateMetadata={({ props }) => {
          const edl = props as ResolvedEDLv1;
          const durationInFrames = getTotalDurationInFrames(edl);
          return {
            durationInFrames,
            fps: edl.format?.fps || 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="Thumbnail"
        component={Thumbnail}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={DEFAULT_EDL}
      />
    </>
  );
};
