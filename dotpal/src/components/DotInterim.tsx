import { type BrailleDot, brailleMap } from "../braille";
import "../styles/BrailleCell.css";

interface Props {
  selectedLetter: string;
  onConfirm: () => void;
}

// Map dot number to position (row, col) in 3x2 matrix
const dotPositions: Record<BrailleDot, { row: number; col: number }> = {
  1: { row: 0, col: 0 },
  2: { row: 1, col: 0 },
  3: { row: 2, col: 0 },
  4: { row: 0, col: 1 },
  5: { row: 1, col: 1 },
  6: { row: 2, col: 1 },
};

export default function DotInterim({ selectedLetter, onConfirm }: Props) {
  const correctDots = brailleMap[selectedLetter] || [];
  const dots: BrailleDot[] = [1, 2, 3, 4, 5, 6];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "2rem",
        background: "white",
        borderRadius: "15px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
      }}
    >
      <h2
        style={{
          fontSize: "1.3rem",
          color: "#333",
          textShadow: "none",
          margin: 0,
        }}
      >
        Here's the braille for{" "}
        <span
          style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#4facfe" }}
        >
          {selectedLetter.toUpperCase()}
        </span>
      </h2>
      <div className="braille-cell">
        {dots.map((dot) => {
          const pos = dotPositions[dot];
          const isCorrect = correctDots.includes(dot);

          return (
            <div
              key={dot}
              className={`dot ${isCorrect ? "pressed" : ""}`}
              style={{
                gridRow: pos.row + 1,
                gridColumn: pos.col + 1,
                cursor: "default",
                pointerEvents: "none",
              }}
            >
              <span className="dot-number">{dot}</span>
            </div>
          );
        })}
      </div>
      <button
        onClick={onConfirm}
        style={{
          padding: "0.75rem 2rem",
          fontSize: "1.1rem",
          fontWeight: "bold",
          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(79, 172, 254, 0.3)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 6px 16px rgba(79, 172, 254, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 4px 12px rgba(79, 172, 254, 0.3)";
        }}
      >
        ✓ Confirm
      </button>
    </div>
  );
}
