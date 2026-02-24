import { useEffect } from "react";
import { brailleMap, type BrailleDot } from "../braille";
import BrailleCell from "./BrailleCell";
import { typography, spacing } from "../styles/theme";

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
        justifyContent: "flex-start",
        gap: "0.3rem",
        padding: "clamp(1rem, 2.5vw, 1.5rem)",
        background: "#ffffff",
        borderRadius: "0px",
        boxShadow: "0 0 0 2px #000000",
        maxWidth: "100%",
        width: "100%",
        height: "fit-content",
        maxHeight: "90vh",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* Letter display */}
      <div
        style={{
          fontSize:
            mode === "dot"
              ? "clamp(2rem, 5vw, 3rem)"
              : mode === "word"
                ? "clamp(2.5rem, 6vw, 4rem)"
                : "clamp(5rem, 14vw, 8rem)",
          fontWeight: "900",
          color: "#000000",
          textShadow: "none",
          animation: mode === "letter" ? "none" : "pulse 2s infinite",
          margin: 0,
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
            gap: "0.1rem",
            width: "100%",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              ...typography.heading2,
              color: "#000000",
              textShadow: "none",
              margin: 0,
              textAlign: "center",
              fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
            }}
          >
            Braille for{" "}
            <span
              style={{
                fontWeight: "900",
                fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                color: "#000000",
              }}
            >
              {selectedLetter.toUpperCase()}
            </span>
          </h2>
          <div
            style={{
              width: "100%",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
            }}
          >
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
            maxWidth: "100%",
            border: "3px solid #000000",
          }}
        >
          <img
            src={`/pictures/word_mode_${selectedLetter.toLowerCase()}.jpeg`}
            alt={selectedLetter}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "clamp(200px, 45vh, 350px)",
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
          fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
        }}
      >
        Press SUBMIT
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
