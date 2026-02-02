'use client';
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import { fitText } from "@remotion/layout-utils";
import { makeTransform, scale, translateY } from "@remotion/animation-utils";
import { TikTokPage } from "@remotion/captions";

const fontFamily = "Bangers";

loadFont({
  family: fontFamily,
  url: "https://fonts.gstatic.com/s/bangers/v24/FeVQS0BTqb0h60ACH55Q2J5hm24.ttf",
});

const container: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  top: undefined,
  bottom: 350,
  height: 150,
};

const DESIRED_FONT_SIZE = 180;
const PHRASE_FONT_SIZE = 80; // Smaller for phrase mode

export type CaptionMode = "word" | "phrase" | "character";

export const CaptionRenderer: React.FC<{
  readonly enterProgress: number;
  readonly page: TikTokPage;
  readonly mode?: CaptionMode;
  readonly highlightColor?: string;
}> = ({ enterProgress, page, mode = "word", highlightColor = "#FFFF00" }) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();
  const timeInMs = (frame / fps) * 1000;

  // Find current token index
  const currentTokenIndex = page.tokens.findIndex((t) => {
    const startRelativeToSequence = t.fromMs - page.startMs;
    const endRelativeToSequence = t.toMs - page.startMs;
    return startRelativeToSequence <= timeInMs && endRelativeToSequence > timeInMs;
  });

  const currentToken = currentTokenIndex >= 0 ? page.tokens[currentTokenIndex] : null;

  // Memoize text fitting to avoid recalculation on every frame
  const fontSize = useMemo(() => {
    const targetSize = (mode === "phrase" || mode === "character") ? PHRASE_FONT_SIZE : DESIRED_FONT_SIZE;
    const textToFit = (mode === "phrase" || mode === "character") ? page.text : (currentToken?.text || "W");

    try {
      const fittedText = fitText({
        fontFamily: fontFamily,
        text: textToFit,
        withinWidth: width * 0.9,
        textTransform: "uppercase",
      });
      return Math.min(targetSize, fittedText.fontSize);
    } catch (error) {
      const textLength = textToFit.length;
      const targetWidth = width * 0.9;
      const approximateFontSize = Math.floor(targetWidth / (textLength * 0.6));
      return Math.min(targetSize, Math.max(40, approximateFontSize));
    }
  }, [page.text, width, mode, currentToken?.text]);

  // Word mode: show only current word
  if (mode === "word") {
    return (
      <AbsoluteFill style={container}>
        <div
          style={{
            fontSize,
            fontWeight: 900,
            color: "white",
            WebkitTextStroke: "8px black",
            paintOrder: "stroke fill",
            transform: makeTransform([
              scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
              translateY(interpolate(enterProgress, [0, 1], [50, 0])),
            ]),
            fontFamily,
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          {currentToken?.text || ""}
        </div>
      </AbsoluteFill>
    );
  }

  // Phrase mode: show all words with current one highlighted
  // Character mode: show all words with current character highlighted
  return (
    <AbsoluteFill style={container}>
      <div
        style={{
          fontSize,
          fontWeight: 900,
          transform: makeTransform([
            scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
            translateY(interpolate(enterProgress, [0, 1], [50, 0])),
          ]),
          fontFamily,
          textTransform: "uppercase",
          letterSpacing: "2px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "0 20px",
        }}
      >
        {page.tokens.map((token, tokenIndex) => {
          // Skip whitespace-only tokens
          if (token.text.trim() === "") {
            return null;
          }

          // Calculate timing relative to page start
          const tokenStartMs = token.fromMs - page.startMs;
          const tokenEndMs = token.toMs - page.startMs;

          // For phrase mode - highlight whole word
          if (mode === "phrase") {
            const isCurrentWord = tokenStartMs <= timeInMs && tokenEndMs > timeInMs;
            const isPastWord = tokenEndMs <= timeInMs;

            return (
              <span
                key={tokenIndex}
                style={{
                  color: isCurrentWord ? highlightColor : (isPastWord ? "#888888" : "white"),
                  WebkitTextStroke: "3px black",
                  paintOrder: "stroke fill",
                  textShadow: isCurrentWord ? `0 0 20px ${highlightColor}` : "none",
                  marginRight: "12px",
                }}
              >
                {token.text}
              </span>
            );
          }

          // Character mode - highlight character by character
          const tokenDuration = tokenEndMs - tokenStartMs;
          const chars = token.text.split("");

          return (
            <span key={tokenIndex} style={{ marginRight: "12px", display: "inline-flex" }}>
              {chars.map((char, charIndex) => {
                // Interpolate character timing within the word
                const charStartMs = tokenStartMs + (tokenDuration * charIndex / chars.length);
                const charEndMs = tokenStartMs + (tokenDuration * (charIndex + 1) / chars.length);

                const isCurrentChar = charStartMs <= timeInMs && charEndMs > timeInMs;
                const isPastChar = charEndMs <= timeInMs;

                return (
                  <span
                    key={charIndex}
                    style={{
                      color: isCurrentChar ? highlightColor : (isPastChar ? "#888888" : "white"),
                      WebkitTextStroke: "3px black",
                      paintOrder: "stroke fill",
                      textShadow: isCurrentChar ? `0 0 20px ${highlightColor}` : "none",
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
