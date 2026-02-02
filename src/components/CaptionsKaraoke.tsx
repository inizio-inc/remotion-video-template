import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { VideoPlanV1 } from "../types";

interface KaraokeCaptionsProps {
  text: string;
  timestamps?: VideoPlanV1["scenes"][number]["timestamps"];
  fps: number;
}

export const KaraokeCaptions: React.FC<KaraokeCaptionsProps> = ({ text, timestamps, fps }) => {
  const frame = useCurrentFrame();
  const time = frame / fps;

  const chars = timestamps?.characters || text.split("");
  const starts = timestamps?.characterStartTimesSeconds;

  let revealIndex = chars.length - 1;
  if (starts && starts.length === chars.length) {
    revealIndex = -1;
    for (let i = 0; i < starts.length; i += 1) {
      if (starts[i] <= time) {
        revealIndex = i;
      } else {
        break;
      }
    }
  }

  const revealed = chars.slice(0, Math.max(0, revealIndex + 1)).join("");
  const remaining = chars.slice(Math.max(0, revealIndex + 1)).join("");

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "6%",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          fontSize: 54,
          lineHeight: 1.2,
          fontWeight: 700,
          color: "#F5F5F5",
          textShadow: "0 6px 20px rgba(0,0,0,0.6)",
          whiteSpace: "pre-wrap",
          background: "rgba(0,0,0,0.45)",
          borderRadius: 24,
          padding: "28px 36px",
        }}
      >
        <span style={{ color: "#FFD500" }}>{revealed}</span>
        <span style={{ color: "#F5F5F5" }}>{remaining}</span>
      </div>
    </AbsoluteFill>
  );
};
