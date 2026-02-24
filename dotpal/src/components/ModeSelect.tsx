import type { Mode } from "./BrailleApp";
import { buttonStyles, spacing } from "../styles/theme";

interface Props {
  onSelect: (mode: Mode) => void;
  mode?: Mode;
  showOnlyOtherModes?: boolean;
}

export default function ModeSelect({
  onSelect,
  mode,
  showOnlyOtherModes = false,
}: Props) {
  const handleModeSelect = (selectedMode: Mode) => {
    onSelect(selectedMode);
  };

  const modes: Mode[] = ["letter", "word", "dot"];
  const modesToShow = showOnlyOtherModes
    ? modes.filter((m) => m !== mode)
    : modes;

  const modeEmojis: Record<Mode, string> = {
    letter: "📝",
    word: "🍎",
    dot: "⚪",
  };

  const modeLabels: Record<Mode, string> = {
    letter: "Letter",
    word: "Word",
    dot: "Dot",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: spacing.sm,
        width: "100%",
      }}
    >
      {modesToShow.map((m) => (
        <button
          key={m}
          onClick={() => handleModeSelect(m)}
          style={{
            ...buttonStyles.primary(),
            padding: "0.6rem 1rem",
            fontSize: "0.9rem",
            ...(mode === m
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
          {modeEmojis[m]} {modeLabels[m]}
        </button>
      ))}
    </div>
  );
}
