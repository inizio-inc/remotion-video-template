/**
 * Sample data for video examples
 * Tokyo travel video - 7 scenes, ~17.5 seconds
 */

import tokyoScenes from './tokyo-scenes.json';
import tokyoManifest from './tokyo-manifest.json';

// Types
export interface SceneScript {
  name: string;
  script: string;
}

export interface SceneTimestamps {
  characters: string[];
  characterStartTimesSeconds: number[];
  characterEndTimesSeconds: number[];
}

export interface Scene {
  id: number;
  name: string;
  text: string;
  wordCount: number;
  startTime: number;
  endTime: number;
  durationInSeconds: number;
  durationInFrames: number;
  audioPath: string;
  timestamps?: SceneTimestamps;
}

export interface AudioTrack {
  startMs: number;
  endMs: number;
  audioUrl: string;
}

export interface TextTrack {
  startMs: number;
  endMs: number;
  text: string;
  position: string;
  timestamps?: SceneTimestamps;
}

export interface TimelineScene {
  name: string;
  text: string;
  startMs: number;
  endMs: number;
}

export interface Timeline {
  shortTitle: string;
  elements: unknown[];
  audio: AudioTrack[];
  text: TextTrack[];
  scenes: TimelineScene[];
}

export interface VideoManifest {
  music: {
    path: string;
    duration: number;
    prompt: string;
    cost: number;
  };
  thumbnail: string;
  images: unknown[];
  videos: unknown[];
  scenes: Scene[];
  timeline: Timeline;
  totalDurationInFrames: number;
  fps: number;
  totalCost: number;
  createdAt: string;
}

export interface ScenesFile {
  scenes: SceneScript[];
}

// Exports
export const TOKYO_SCENES: ScenesFile = tokyoScenes;
export const TOKYO_MANIFEST: VideoManifest = tokyoManifest as VideoManifest;

// Helper to get scene by name
export const getSceneByName = (name: string): Scene | undefined => {
  return TOKYO_MANIFEST.scenes.find(s => s.name === name);
};

// Helper to get all scene texts
export const getAllSceneTexts = (): string[] => {
  return TOKYO_MANIFEST.scenes.map(s => s.text);
};

// Total duration in seconds
export const TOKYO_DURATION_SECONDS = TOKYO_MANIFEST.totalDurationInFrames / TOKYO_MANIFEST.fps;
