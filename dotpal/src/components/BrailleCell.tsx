import { type BrailleDot } from "../braille";
import "../styles/BrailleCell.css";

interface Props {
  selectedLetter: string;
  dotsPressed?: BrailleDot[];
  onDotToggle?: (dot: BrailleDot) => void;
  correctDots?: BrailleDot[];
}

// Map dot number to position (row, col) in 3x2 matrix
// Standard braille layout: 1,2,3 on left, 4,5,6 on right
const dotPositions: Record<BrailleDot, { row: number; col: number }> = {
  1: { row: 0, col: 0 },
  2: { row: 1, col: 0 },
  3: { row: 2, col: 0 },
  4: { row: 0, col: 1 },
  5: { row: 1, col: 1 },
  6: { row: 2, col: 1 },
};

// Reverse mapping to find which key produces each dot
const dotToKey: Record<BrailleDot, string> = {
  1: "[",
  2: ";",
  3: ".",
  4: "]",
  5: "'",
  6: "/",
};

export default function BrailleCell({
  selectedLetter,
  dotsPressed = [],
  onDotToggle,
  correctDots = [],
}: Props) {
  const dots: BrailleDot[] = [1, 2, 3, 4, 5, 6];
  const isReadOnly = !onDotToggle;
  const activeDots = isReadOnly ? correctDots : dotsPressed;

  return (
    <div className="braille-cell-container">
      <h3>Type: {selectedLetter.toUpperCase()}</h3>
      <div className="braille-cell">
        {dots.map((dot) => {
          const pos = dotPositions[dot];
          const isActive = activeDots.includes(dot);
          const key = dotToKey[dot];

          return (
            <div
              key={dot}
              className={`dot ${isActive ? "pressed" : ""}`}
              style={{
                gridRow: pos.row + 1,
                gridColumn: pos.col + 1,
                ...(isReadOnly
                  ? { cursor: "default", pointerEvents: "none" }
                  : {}),
              }}
              onClick={() => !isReadOnly && onDotToggle?.(dot)}
              title={isReadOnly ? `Dot ${dot}` : `Dot ${dot} (Press '${key}')`}
            >
              <span className="dot-number">{dot}</span>
              {!isReadOnly && <span className="key-label">{key}</span>}
            </div>
          );
        })}
      </div>
      {!isReadOnly && (
        <p className="dots-info">
          Dots pressed: {dotsPressed.join(", ") || "none"}
        </p>
      )}
    </div>
  );
}
