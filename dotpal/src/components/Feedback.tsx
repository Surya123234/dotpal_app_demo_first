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
    <div>
      {feedback.correct ? (
        <>
          <h2>✅ Correct!</h2>
          <button onClick={reset}>
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
          <h2>❌ Wrong</h2>
          <p>
            Correct dots for <strong>{selectedLetter}</strong>:{" "}
            {feedback.correctDots.join(", ")}
          </p>
          <button onClick={reset}>Try Again</button>
        </>
      )}
    </div>
  );
}
