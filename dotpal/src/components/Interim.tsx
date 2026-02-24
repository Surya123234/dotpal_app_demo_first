import { useEffect } from "react";
import { brailleMap, type BrailleDot } from "../braille";
import BrailleCell from "./BrailleCell";
import { boxStyles, typography, spacing } from "../styles/theme";

interface Props {
  mode: "letter" | "word" | "dot";
  selectedLetter: string;
}

export default function Interim({ mode, selectedLetter }: Props) {
  // Load audio based on mode
  useEffect(() => {
    const audioPath = `/audios/${mode}_mode_${selectedLetter.toLowerCase()}.mp3`;
    const audio = new Audio(audioPath);
    audio.play().catch(() => {
      /* ignore play errors */
    });
  }, [selectedLetter, mode]);

  const correctDots = brailleMap[selectedLetter.toLowerCase()] || [];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.lg,
        padding: "clamp(1.5rem, 3vw, 2rem)",
        background: "#ffffff",
        borderRadius: "0px",
        boxShadow: "0 0 0 2px #000000",
        maxWidth: "clamp(500px, 90vw, 750px)",
        width: "100%",
      }}
    >
      {/* Letter display */}
      <div
        style={{
          fontSize:
            mode === "dot"
              ? "clamp(2.5rem, 6vw, 3.5rem)"
              : mode === "word"
                ? "clamp(3rem, 8vw, 5rem)"
                : "clamp(5rem, 12vw, 8rem)",
          fontWeight: "900",
          color: "#000000",
          textShadow: "none",
          animation: mode === "letter" ? "none" : "pulse 2s infinite",
        }}
      >
        {selectedLetter.toUpperCase()}
      </div>

      {/* Mode-specific content */}
      {mode === "dot" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: spacing.lg,
            width: "100%",
          }}
        >
          <h2
            style={{
              ...typography.heading2,
              color: "#000000",
              textShadow: "none",
              margin: 0,
              textAlign: "center",
              fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
            }}
          >
            Here's the braille for{" "}
            <span
              style={{
                fontWeight: "900",
                fontSize: "clamp(1.4rem, 3.5vw, 1.8rem)",
                color: "#000000",
              }}
            >
              {selectedLetter.toUpperCase()}
            </span>
          </h2>
          <div style={{ width: "100%", maxHeight: "60vh", overflow: "auto" }}>
            <BrailleCell
              selectedLetter={selectedLetter}
              correctDots={correctDots as BrailleDot[]}
            />
          </div>
        </div>
      )}

      {mode === "word" && (
        <div
          style={{
            borderRadius: "0px",
            overflow: "hidden",
            boxShadow: "0 0 0 2px #000000",
            width: "100%",
            maxWidth: "clamp(400px, 85vw, 600px)",
            border: "3px solid #000000",
          }}
        >
          <img
            src={`/pictures/word_mode_${selectedLetter.toLowerCase()}.jpeg`}
            alt={selectedLetter}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "clamp(250px, 50vh, 400px)",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      <p
        style={{
          ...typography.label,
          margin: 0,
          color: "#000000",
          fontSize: "clamp(1rem, 2vw, 1.2rem)",
        }}
      >
        Press SUBMIT when ready
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
