import type { Mode } from "../App";

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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        padding: "2rem 1.5rem",
        background: "white",
        borderRadius: "15px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        minWidth: "200px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "1.8rem", color: "#333", margin: 0 }}>DotPal</h1>
      <p style={{ fontSize: "0.9rem", color: "#666", margin: "0 0 0.5rem 0" }}>
        Learn Braille!
      </p>
      <h2 style={{ fontSize: "1rem", color: "#667eea", margin: "0.5rem 0" }}>
        Mode
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          width: "100%",
        }}
      >
        <button
          onClick={() => handleModeSelect("letter")}
          style={{
            padding: "0.7rem 1rem",
            fontSize: "0.95rem",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
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
          📝 Letter
        </button>
        <button
          onClick={() => handleModeSelect("word")}
          style={{
            padding: "0.7rem 1rem",
            fontSize: "0.95rem",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 4px 12px rgba(245, 87, 108, 0.3)",
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
          🍎 Word
        </button>
        <button
          onClick={() => handleModeSelect("dot")}
          style={{
            padding: "0.7rem 1rem",
            fontSize: "0.95rem",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 4px 12px rgba(79, 172, 254, 0.3)",
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
          ⚪ Dot
        </button>
      </div>
    </div>
  );
}
