import { useEffect } from "react";

interface Props {
  selectedLetter: string;
  onConfirm: () => void;
}

export default function WordInterim({ selectedLetter, onConfirm }: Props) {
  useEffect(() => {
    const audio = new Audio(
      `/audios/${selectedLetter.toLowerCase()}_apple.mp3`
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
        padding: "2rem",
        background: "white",
        borderRadius: "15px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
      }}
    >
      <div
        style={{
          fontSize: "5rem",
          fontWeight: "bold",
          color: "#f5576c",
          textShadow: "0 2px 10px rgba(245, 87, 108, 0.2)",
          animation: "pulse 2s infinite",
        }}
      >
        {selectedLetter.toUpperCase()}
      </div>
      <div
        style={{
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(245, 87, 108, 0.15)",
          width: "100%",
          maxWidth: "450px",
        }}
      >
        <img
          src="/pictures/apple.jpeg"
          alt="apple"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "380px",
            objectFit: "cover",
          }}
        />
      </div>
      <button
        onClick={onConfirm}
        style={{
          padding: "0.75rem 2rem",
          fontSize: "1.1rem",
          fontWeight: "bold",
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(245, 87, 108, 0.3)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 6px 16px rgba(245, 87, 108, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 4px 12px rgba(245, 87, 108, 0.3)";
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
