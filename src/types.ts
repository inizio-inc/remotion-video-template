export type ResolvedEDLv1 = {
  schemaVersion: "resolved-edl.v1";
  format: { width: number; height: number; fps: number };
  title?: string;
  captions?: { mode: "none" | "karaoke" | "tiktok" };
  music?: { src: string; volume?: number };
  scenes: Array<{
    id: string;
    name: string;
    durationSec: number;
    background: {
      type: "image" | "video";
      src: string;
      trimInSec?: number;
      trimOutSec?: number;
    };
    voSrc: string;
    onScreen?: { headline?: string; subtitle?: string };
    timestamps?: {
      characters: string[];
      characterStartTimesSeconds: number[];
      characterEndTimesSeconds: number[];
    };
  }>;
};

export type CaptionMode = "none" | "karaoke" | "tiktok";
