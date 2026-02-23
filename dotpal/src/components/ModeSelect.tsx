import type { Mode } from "./BrailleApp";
import {
  boxStyles,
  buttonStyles,
  colorSchemes,
  typography,
  spacing,
} from "../styles/theme";

interface Props {
  onSelect: (mode: Mode) => void;
  mode: Mode; // Added mode prop
}

export default function ModeSelect({ onSelect }: Props) {
  const handleModeSelect = (mode: Mode) => {
    onSelect(mode);
    // Logic to display the corresponding dialogue and screen
  };

  return (
    <div
      style={{
        ...boxStyles.cardSmall,
        minWidth: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: spacing.lg,
      }}
    >
      <h1 style={{ ...typography.heading1 }}>DotPal</h1>
      <p style={{ ...typography.subtitle }}>Learn Braille!</p>
      <h2
        style={{
          ...typography.label,
          color: colorSchemes.letter.primary,
          margin: `${spacing.sm} 0`,
        }}
      >
        Mode
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing.md,
          width: "100%",
        }}
      >
        <button
          onClick={() => handleModeSelect("letter")}
          style={buttonStyles.primary(colorSchemes.letter.primary)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 6px 16px ${colorSchemes.letter.shadow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 4px 12px ${colorSchemes.letter.shadow}`;
          }}
        >
          📝 Letter
        </button>
        <button
          onClick={() => handleModeSelect("word")}
          style={buttonStyles.primary(colorSchemes.word.primary)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 6px 16px ${colorSchemes.word.shadow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 4px 12px ${colorSchemes.word.shadow}`;
          }}
        >
          🍎 Word
        </button>
        <button
          onClick={() => handleModeSelect("dot")}
          style={buttonStyles.primary(colorSchemes.dot.primary)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 6px 16px ${colorSchemes.dot.shadow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 4px 12px ${colorSchemes.dot.shadow}`;
          }}
        >
          ⚪ Dot
        </button>
      </div>
    </div>
  );
}
