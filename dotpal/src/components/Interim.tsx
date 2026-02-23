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

  const getColorScheme = () => {
    switch (mode) {
      case "letter":
        return {
          letterColor: "#667eea",
          shadowColor: "rgba(102, 126, 234, 0.2)",
          accentColor: "#667eea",
        };
      case "word":
        return {
          letterColor: "#f5576c",
          shadowColor: "rgba(245, 87, 108, 0.2)",
          accentColor: "#f5576c",
        };
      case "dot":
        return {
          letterColor: "#4facfe",
          shadowColor: "rgba(79, 172, 254, 0.2)",
          accentColor: "#4facfe",
        };
    }
  };

  const colors = getColorScheme();
  const correctDots = brailleMap[selectedLetter.toLowerCase()] || [];

  return (
    <div style={boxStyles.card}>
      {/* Letter display */}
      <div
        style={{
          fontSize:
            mode === "dot" ? "3rem" : mode === "word" ? "5rem" : "10rem",
          fontWeight: "bold",
          color: mode === "letter" ? "black" : colors.letterColor,
          textShadow:
            mode === "letter" ? "none" : `0 2px 10px ${colors.shadowColor}`,
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
              ...typography.heading1,
              color: "#333",
              textShadow: "none",
              margin: `0 0 ${spacing.lg} 0`,
              textAlign: "center",
            }}
          >
            Here's the braille for{" "}
            <span
              style={{
                fontWeight: "bold",
                fontSize: "1.5rem",
                color: colors.accentColor,
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
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: `0 8px 32px ${colors.shadowColor}`,
            width: "100%",
            maxWidth: "450px",
          }}
        >
          <img
            src={`/pictures/word_mode_${selectedLetter.toLowerCase()}.jpeg`}
            alt={selectedLetter}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "380px",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      <p style={{ ...typography.label, margin: 0 }}>Press SUBMIT when ready</p>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
