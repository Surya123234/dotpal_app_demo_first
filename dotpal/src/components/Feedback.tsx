import { useEffect } from "react";
import type { FeedbackResult } from "../App";

interface Props {
  feedback: FeedbackResult;
  selectedLetter: string;
  selectedMode: string;
  reset: () => void;
}

export default function Feedback({
  feedback,
  selectedLetter,
  selectedMode,
  reset,
}: Props) {
  useEffect(() => {
    const audio = new Audio(
      feedback.correct ? "/audios/yay.mp3" : "/audios/wrong.mp3"
    );
    audio.play().catch(() => {
      /* ignore play errors (autoplay policy, etc.) */
    });
  }, [feedback.correct]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
        padding: "2rem",
        borderRadius: "15px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        maxWidth: "600px",
      }}
    >
      {feedback.correct ? (
        <>
          <h2
            style={{
              fontSize: "2.5rem",
              margin: "0 0 1rem 0",
              color: "#34a853",
            }}
          >
            ✅ Correct!
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#666",
              marginBottom: "1.5rem",
            }}
          >
            Great job! You got it right!
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1.1rem",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(132, 250, 176, 0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(132, 250, 176, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(132, 250, 176, 0.3)";
            }}
          >
            Next{" "}
            {selectedMode === "letter"
              ? "Letter"
              : selectedMode === "word"
              ? "Word"
              : "Dot"}
          </button>
        </>
      ) : (
        <>
          <h2
            style={{
              fontSize: "2.5rem",
              margin: "0 0 1rem 0",
              color: "#ea4335",
            }}
          >
            ❌ Not Quite!
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#666",
              marginBottom: "1.5rem",
            }}
          >
            Correct dots for <strong>{selectedLetter.toUpperCase()}</strong>:
          </p>
          <p
            style={{
              fontSize: "1.3rem",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "1.5rem",
              padding: "1rem",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            {feedback.correctDots.join(", ")}
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1.1rem",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(250, 112, 154, 0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(250, 112, 154, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(250, 112, 154, 0.3)";
            }}
          >
            Try Again
          </button>
        </>
      )}
    </div>
  );
}
