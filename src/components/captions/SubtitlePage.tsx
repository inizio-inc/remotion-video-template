import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CaptionRenderer, CaptionMode } from "./CaptionRenderer";
import { TikTokPage } from "@remotion/captions";

const SubtitlePage: React.FC<{
  readonly page: TikTokPage;
  readonly captionMode?: CaptionMode;
  readonly highlightColor?: string;
}> = ({ page, captionMode = "word", highlightColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: {
      damping: 200,
    },
    durationInFrames: 5,
  });

  return (
    <AbsoluteFill>
      <CaptionRenderer
        enterProgress={enter}
        page={page}
        mode={captionMode}
        highlightColor={highlightColor}
      />
    </AbsoluteFill>
  );
};

export { SubtitlePage };
