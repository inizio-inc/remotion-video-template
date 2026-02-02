import type { ResolvedEDLv1 } from "../types";

export const DEFAULT_FPS = 30;

export const getFps = (edl: ResolvedEDLv1): number => {
  return edl.format?.fps || DEFAULT_FPS;
};

export const getSceneDurationInFrames = (scene: ResolvedEDLv1["scenes"][number], fps: number): number => {
  const duration = Math.round(scene.durationSec * fps);
  return Math.max(1, duration);
};

export const getTotalDurationInFrames = (edl: ResolvedEDLv1): number => {
  const fps = getFps(edl);
  const total = edl.scenes.reduce((sum, scene) => sum + getSceneDurationInFrames(scene, fps), 0);
  return Math.max(1, total);
};

export const getCaptionMode = (edl: ResolvedEDLv1): "none" | "karaoke" | "tiktok" => {
  return edl.captions?.mode || "none";
};
