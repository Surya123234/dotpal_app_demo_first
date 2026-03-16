import { useEffect } from "react";
import type { FeedbackResult } from "./BrailleApp";
import BrailleCell from "./BrailleCell";
import { boxStyles, buttonStyles, typography } from "../styles/theme";
import { supabase } from "../supabase";

interface Props {
  feedback: FeedbackResult;
  selectedLetter: string;
  selectedMode: string;
  reset: () => void;
  onTryAgain: () => void;
  onNext: () => void;
}

export default function Feedback({
  feedback,
  selectedLetter,
  selectedMode,
  onTryAgain,
  onNext,
}: Props) {
  useEffect(() => {
    const audioName = feedback.correct
      ? "correct_attempt"
      : "incorrect_attempt";
    const audioData = supabase.storage
      .from("media")
      .getPublicUrl(`audio/${audioName}.mp3`);
    const audio = new Audio(audioData.data.publicUrl);
    audio.play().catch(() => {
      /* ignore play errors */
    });
  }, [feedback.correct]);

  return (
    <div style={boxStyles.card}>
      {feedback.correct ? (
        <>
          <h2
            style={{
              ...typography.heading1,
              color: "#000000",
              fontSize: "2.5rem",
            }}
          >
            ✅ Correct!
          </h2>
          <p style={{ ...typography.heading2, color: "#000000" }}>
            Great job! You got it right!
          </p>
          <button
            onClick={onNext}
            style={buttonStyles.primary()}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(-2px, -2px)";
              e.currentTarget.style.boxShadow = "6px 6px 0px black";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "4px 4px 0px black";
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
              ...typography.heading1,
              color: "#000000",
              fontSize: "2.5rem",
            }}
          >
            ❌ Not Quite!
          </h2>
          <p
            style={{
              ...typography.heading2,
              color: "#000000",
              margin: "0",
            }}
          >
            Correct dots for <strong>{selectedLetter.toUpperCase()}</strong>:
          </p>
          <div style={{ margin: "0" }}>
            <BrailleCell
              selectedLetter={selectedLetter}
              correctDots={feedback.correctDots}
            />
          </div>
          <button
            onClick={onTryAgain}
            style={buttonStyles.primary()}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(-2px, -2px)";
              e.currentTarget.style.boxShadow = "6px 6px 0px black";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "4px 4px 0px black";
            }}
          >
            Try Again
          </button>
        </>
      )}
    </div>
  );
}
