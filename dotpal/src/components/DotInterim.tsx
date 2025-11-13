import { useEffect } from "react";
import { brailleMap } from "../braille";
import BrailleCell from "./BrailleCell";

interface Props {
  selectedLetter: string;
  onConfirm: () => void;
}

export default function DotInterim({ selectedLetter, onConfirm }: Props) {
  useEffect(() => {
    const audio = new Audio(`/audios/A_dot1.mp3`);
    audio.play().catch(() => {
      /* ignore play errors */
    });
  }, [selectedLetter]);

  const correctDots = brailleMap[selectedLetter] || [];

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
      <BrailleCell selectedLetter={selectedLetter} correctDots={correctDots} />
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
