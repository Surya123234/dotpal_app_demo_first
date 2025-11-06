import { useEffect } from "react";
import type { FeedbackResult } from "../App";

interface Props {
  feedback: FeedbackResult;
  selectedLetter: string;
  reset: () => void;
}

export default function Feedback({ feedback, selectedLetter, reset }: Props) {
  useEffect(() => {
    if (feedback.correct) {
      const audio = new Audio("/audios/yay.mp3");
      audio.play().catch(() => {
        /* ignore play errors (autoplay policy, etc.) */
      });
    } else {
      const audio = new Audio("/audios/wrong.mp3");
      audio.play().catch(() => {
        /* ignore play errors (autoplay policy, etc.) */
      });
    }
  }, [feedback.correct]);

  return (
    <div>
      {feedback.correct ? (
        <>
          <h2>✅ Correct!</h2>
          <button onClick={reset}>Next Letter</button>
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
