import type { VideoPlanV1 } from "../types";

export const DEFAULT_FPS = 30;

export const getFps = (plan: VideoPlanV1): number => {
  return plan.format?.fps || DEFAULT_FPS;
};

export const getSceneDurationInFrames = (scene: VideoPlanV1["scenes"][number], fps: number): number => {
  const duration = Math.round(scene.durationSec * fps);
  return Math.max(1, duration);
};

export const getTotalDurationInFrames = (plan: VideoPlanV1): number => {
  const fps = getFps(plan);
  const total = plan.scenes.reduce((sum, scene) => sum + getSceneDurationInFrames(scene, fps), 0);
  return Math.max(1, total);
};

export const getCaptionMode = (plan: VideoPlanV1): "none" | "karaoke" | "tiktok" => {
  return plan.captions?.mode || "none";
};
