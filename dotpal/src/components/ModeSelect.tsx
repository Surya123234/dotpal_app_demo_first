import type { Mode } from "./BrailleApp";
import { buttonStyles, spacing } from "../styles/theme";

interface Props {
  onSelect: (mode: Mode) => void;
  mode?: Mode;
}

export default function ModeSelect({ onSelect, mode }: Props) {
  const handleModeSelect = (selectedMode: Mode) => {
    onSelect(selectedMode);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: spacing.md,
        width: "100%",
      }}
    >
      <button
        onClick={() => handleModeSelect("letter")}
        style={{
          ...buttonStyles.primary(),
          ...(mode === "letter"
            ? {
                border: "3px solid #000000",
                boxShadow: `6px 6px 0px rgba(0,0,0,0.5)`,
                transform: "translate(-2px, -2px)",
              }
            : {
                boxShadow: `4px 4px 0px rgba(0,0,0,0.3)`,
              }),
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translate(-2px, -2px)";
          e.currentTarget.style.boxShadow = "6px 6px 0px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "4px 4px 0px rgba(0,0,0,0.3)";
        }}
      >
        📝 Letter
      </button>
      <button
        onClick={() => handleModeSelect("word")}
        style={{
          ...buttonStyles.primary(),
          ...(mode === "word"
            ? {
                border: "3px solid #000000",
                boxShadow: `6px 6px 0px rgba(0,0,0,0.5)`,
                transform: "translate(-2px, -2px)",
              }
            : {
                boxShadow: `4px 4px 0px rgba(0,0,0,0.3)`,
              }),
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translate(-2px, -2px)";
          e.currentTarget.style.boxShadow = "6px 6px 0px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "4px 4px 0px rgba(0,0,0,0.3)";
        }}
      >
        🍎 Word
      </button>
      <button
        onClick={() => handleModeSelect("dot")}
        style={{
          ...buttonStyles.primary(),
          ...(mode === "dot"
            ? {
                border: "3px solid #000000",
                boxShadow: `6px 6px 0px rgba(0,0,0,0.5)`,
                transform: "translate(-2px, -2px)",
              }
            : {
                boxShadow: `4px 4px 0px rgba(0,0,0,0.3)`,
              }),
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translate(-2px, -2px)";
          e.currentTarget.style.boxShadow = "6px 6px 0px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "4px 4px 0px rgba(0,0,0,0.3)";
        }}
      >
        ⚪ Dot
      </button>
    </div>
  );
}
