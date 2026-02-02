import { AbsoluteFill, useCurrentFrame } from "remotion";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { VideoPlanV1 } from "../types";

interface TikTokCaptionsProps {
  text: string;
  timestamps?: VideoPlanV1["scenes"][number]["timestamps"];
  fps: number;
}

type CaptionToken = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number;
  confidence?: number;
};

const buildCaptionsFromCharacters = (
  timestamps: VideoPlanV1["scenes"][number]["timestamps"]
): CaptionToken[] => {
  if (!timestamps) {
    return [];
  }

  const { characters, characterStartTimesSeconds, characterEndTimesSeconds } = timestamps;
  const captions: CaptionToken[] = [];

  let pendingWhitespace = "";
  let currentWord = "";
  let wordStartMs = 0;
  let wordEndMs = 0;

  for (let i = 0; i < characters.length; i += 1) {
    const char = characters[i];
    const isWhitespace = /\s/.test(char);

    if (isWhitespace) {
      if (currentWord) {
        captions.push({
          text: currentWord,
          startMs: wordStartMs,
          endMs: wordEndMs,
          timestampMs: Math.round((wordStartMs + wordEndMs) / 2),
        });
        currentWord = "";
      }
      pendingWhitespace += char;
      continue;
    }

    if (!currentWord) {
      wordStartMs = Math.round((characterStartTimesSeconds[i] || 0) * 1000);
      currentWord = `${pendingWhitespace}${char}`;
      pendingWhitespace = "";
    } else {
      currentWord += char;
    }

    wordEndMs = Math.round((characterEndTimesSeconds[i] || characterStartTimesSeconds[i] || 0) * 1000);
  }

  if (currentWord) {
    captions.push({
      text: currentWord,
      startMs: wordStartMs,
      endMs: wordEndMs,
      timestampMs: Math.round((wordStartMs + wordEndMs) / 2),
    });
  }

  return captions;
};

export const TikTokCaptions: React.FC<TikTokCaptionsProps> = ({ timestamps, fps }) => {
  const frame = useCurrentFrame();
  const timeMs = (frame / fps) * 1000;

  if (!timestamps) {
    return null;
  }

  const captions = buildCaptionsFromCharacters(timestamps);
  if (captions.length === 0) {
    return null;
  }

  const pages = createTikTokStyleCaptions({
    captions: captions as any,
    combineTokensWithinMilliseconds: 1200,
  });

  const activePage = pages.find((page: any) => timeMs >= page.startMs && timeMs <= page.endMs);
  if (!activePage) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: "10%",
        paddingLeft: "8%",
        paddingRight: "8%",
      }}
    >
      <div
        style={{
          fontSize: 64,
          lineHeight: 1.1,
          fontWeight: 800,
          color: "#FFFFFF",
          textAlign: "center",
          whiteSpace: "pre",
          textShadow: "0 8px 24px rgba(0,0,0,0.6)",
        }}
      >
        {activePage.tokens.map((token: any, index: number) => {
          const isActive = timeMs >= token.fromMs && timeMs <= token.toMs;
          return (
            <span key={`${token.text}-${index}`} style={{ color: isActive ? "#FFD500" : "#FFFFFF" }}>
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
