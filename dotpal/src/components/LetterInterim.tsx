import { useEffect } from "react";

interface Props {
  selectedLetter: string;
  onConfirm: () => void;
}

export default function LetterInterim({ selectedLetter, onConfirm }: Props) {
  useEffect(() => {
    const audio = new Audio(
      `/audios/Pronounce_${selectedLetter.toLowerCase()}.mp3`
    );
    audio.play().catch(() => {
      /* ignore play errors */
    });
  }, [selectedLetter]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        background: "white",
        padding: "3rem 2rem",
        borderRadius: "15px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
      }}
    >
      <div
        style={{
          fontSize: "8rem",
          fontWeight: "bold",
          color: "#667eea",
          textShadow: "0 2px 10px rgba(102, 126, 234, 0.2)",
          animation: "pulse 2s infinite",
        }}
      >
        {selectedLetter.toUpperCase()}
      </div>
      <button
        onClick={onConfirm}
        style={{
          padding: "0.75rem 2rem",
          fontSize: "1.1rem",
          fontWeight: "bold",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 6px 16px rgba(102, 126, 234, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 4px 12px rgba(102, 126, 234, 0.3)";
        }}
      >
        ✓ Confirm
      </button>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
