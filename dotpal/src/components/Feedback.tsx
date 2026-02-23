import { useEffect } from "react";
import type { FeedbackResult } from "./BrailleApp";
import { boxStyles, buttonStyles, typography } from "../styles/theme";

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
      feedback.correct ? "/audios/yay.mp3" : "/audios/wrong.mp3",
    );
    audio.play().catch(() => {
      /* ignore play errors (autoplay policy, etc.) */
    });
  }, [feedback.correct]);

  return (
    <div style={boxStyles.card}>
      {feedback.correct ? (
        <>
          <h2
            style={{
              ...typography.heading2,
              color: "#34a853",
            }}
          >
            ✅ Correct!
          </h2>
          <p style={typography.label}>Great job! You got it right!</p>
          <button
            onClick={reset}
            style={buttonStyles.primary("#84fab0")}
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
              ...typography.heading2,
              color: "#ea4335",
            }}
          >
            ❌ Not Quite!
          </h2>
          <p style={typography.label}>
            Correct dots for <strong>{selectedLetter.toUpperCase()}</strong>:
          </p>
          <p
            style={{
              ...typography.label,
              fontWeight: "bold",
              background: "#f5f5f5",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            {feedback.correctDots.join(", ")}
          </p>
          <button
            onClick={reset}
            style={buttonStyles.primary("#fa709a")}
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
