import { type BrailleDot } from "../braille";
import BrailleCell from "./BrailleCell";
import {
  boxStyles,
  buttonStyles,
  colorSchemes,
  typography,
  spacing,
} from "../styles/theme";

interface Props {
  selectedLetter: string;
  dotsPressed: BrailleDot[];
  setDotsPressed: (dots: BrailleDot[]) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function BrailleInput({
  selectedLetter,
  dotsPressed,
  setDotsPressed,
  onSubmit,
  onBack,
}: Props) {
  const toggleDot = (dot: BrailleDot) => {
    if (dotsPressed.includes(dot)) {
      setDotsPressed(dotsPressed.filter((d) => d !== dot));
    } else {
      setDotsPressed([...dotsPressed, dot]);
    }
    // Play button select sound
    const audio = new Audio("/audios/button_select.mp3");
    audio.play().catch(() => {
      /* ignore play errors (autoplay policy, etc.) */
    });
  };

  return (
    <div
      style={{
        ...boxStyles.card,
        maxWidth: "700px",
        width: "100%",
        position: "relative",
      }}
    >
      <button
        onClick={onBack}
        style={{
          ...buttonStyles.secondary,
          position: "absolute",
          top: spacing.md,
          right: spacing.md,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(102, 126, 234, 0.2)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        ← Back
      </button>
      <h2
        style={{
          ...typography.heading2,
          margin: `0 0 ${spacing.sm} ${spacing.md}`,
          paddingTop: spacing.md,
        }}
      >
        Enter Braille dots for{" "}
        <span
          style={{
            fontSize: "1.6rem",
            fontWeight: "bold",
            color: colorSchemes.letter.primary,
          }}
        >
          {selectedLetter.toUpperCase()}
        </span>
      </h2>
      <BrailleCell
        dotsPressed={dotsPressed}
        onDotToggle={toggleDot}
        selectedLetter={selectedLetter}
      />
      <div style={{ display: "flex", gap: spacing.md }}>
        <button
          onClick={onSubmit}
          style={buttonStyles.primary(colorSchemes.letter.primary)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 6px 16px ${colorSchemes.letter.buttonShadowHover}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 4px 12px ${colorSchemes.letter.buttonShadow}`;
          }}
        >
          ✓ Submit
        </button>
      </div>
    </div>
  );
}
