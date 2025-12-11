import { type BrailleDot } from "../braille";
import BrailleCell from "./BrailleCell";

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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        padding: "2rem",
        background: "white",
        borderRadius: "15px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        maxWidth: "700px",
        width: "100%",
        position: "relative",
      }}
    >
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "1.5rem",
          padding: "0.6rem 1.2rem",
          fontSize: "0.85rem",
          fontWeight: "bold",
          background: "rgba(102, 126, 234, 0.1)",
          color: "#667eea",
          border: "1.5px solid #667eea",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "all 0.2s",
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
          fontSize: "1.4rem",
          color: "#333",
          margin: "0 0 0.5rem 0",
          paddingTop: "1.5rem",
        }}
      >
        Enter Braille dots for{" "}
        <span
          style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#667eea" }}
        >
          {selectedLetter.toUpperCase()}
        </span>
      </h2>
      <BrailleCell
        dotsPressed={dotsPressed}
        onDotToggle={toggleDot}
        selectedLetter={selectedLetter}
      />
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={onSubmit}
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
          ✓ Submit
        </button>
      </div>
    </div>
  );
}
