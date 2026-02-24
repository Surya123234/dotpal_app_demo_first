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
    <div style={boxStyles.card}>
      {/* Letter display */}
      <div
        style={{
          fontSize:
            mode === "dot" ? "clamp(2.5rem, 8vw, 4rem)" : mode === "word" ? "clamp(3rem, 10vw, 6rem)" : "clamp(5rem, 15vw, 10rem)",
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
        <div>
          <h2
            style={{
              ...typography.heading2,
              color: "#000000",
              textShadow: "none",
              margin: `0 0 ${spacing.lg} 0`,
              textAlign: "center",
            }}
          >
            Here's the braille for{" "}
            <span
              style={{
                fontWeight: "900",
                fontSize: "1.8rem",
                color: "#000000",
              }}
            >
              {selectedLetter.toUpperCase()}
            </span>
          </h2>
          <BrailleCell
            selectedLetter={selectedLetter}
            correctDots={correctDots as BrailleDot[]}
          />
        </div>
      )}

      {mode === "word" && (
        <div
          style={{
            borderRadius: "0px",
            overflow: "hidden",
            boxShadow: "0 0 0 3px #000000",
            width: "100%",
            maxWidth: "500px",
            border: "3px solid #000000",
          }}
        >
          <img
            src={`/pictures/word_mode_${selectedLetter.toLowerCase()}.jpeg`}
            alt={selectedLetter}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "400px",
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
          fontSize: "1.3rem",
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
