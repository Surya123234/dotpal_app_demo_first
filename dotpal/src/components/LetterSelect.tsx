import { useEffect } from "react";

interface Props {
  onSelect: (letter: string) => void;
}

export default function LetterSelect({ onSelect }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      // Only allow single letter keys (a-z)
      if (key.length === 1 && key >= "a" && key <= "z") {
        e.preventDefault();
        e.stopPropagation();
        onSelect(key);
      } else if (
        key.length === 1 ||
        key === "Tab" ||
        key === "Enter" ||
        key === " "
      ) {
        // Block other single keys and system keys
        e.preventDefault();
        e.stopPropagation();
      }
    }

    window.addEventListener("keydown", handleKey, true);
    return () => window.removeEventListener("keydown", handleKey, true);
  }, [onSelect]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "2rem",
        background: "white",
        borderRadius: "15px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", color: "#333", margin: 0 }}>
        🎹 Press a Letter
      </h2>
      <p style={{ fontSize: "0.95rem", color: "#666", margin: 0 }}>(A–Z)</p>
    </div>
  );
}
