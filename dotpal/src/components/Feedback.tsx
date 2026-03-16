import React, { useEffect } from "react";
import type { FeedbackResult } from "./BrailleApp";
import BrailleCell from "./BrailleCell";
import { boxStyles, typography } from "../styles/theme";
import { supabase } from "../supabase";

interface Props {
  feedback: FeedbackResult;
  selectedLetter: string;
  selectedMode: string;
  onAudioEnd?: () => void;
}

export default function Feedback({
  feedback,
  selectedLetter,
  onAudioEnd,
}: Props) {
  useEffect(() => {
    const audioName = feedback.correct
      ? "correct_attempt"
      : "incorrect_attempt";
    const audioData = supabase.storage
      .from("media")
      .getPublicUrl(`audio/${audioName}.mp3`);
    const audio = new Audio(audioData.data.publicUrl);
    audio.addEventListener("ended", () => {
      onAudioEnd?.();
    });
    audio.play().catch(() => {
      onAudioEnd?.();
    });
  }, [feedback.correct, onAudioEnd]);

  const cardStyle: React.CSSProperties = {
    ...boxStyles.card,
    flex: 1,
    alignSelf: "stretch" as const,
    maxHeight: "none",
    overflowY: "hidden" as const,
    justifyContent: "center",
    gap: "clamp(0.5rem, 2vh, 1.5rem)",
    padding: "clamp(1rem, 3vh, 2rem) clamp(1rem, 3vw, 2rem)",
  };

  return (
    <div style={cardStyle}>
      {feedback.correct ? (
        <>
          <h2
            style={{
              ...typography.heading1,
              color: "#000000",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              margin: 0,
            }}
          >
            ✅ Correct!
          </h2>
          <p
            style={{
              ...typography.heading2,
              color: "#000000",
              fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
              margin: 0,
            }}
          >
            Great job! You got it right!
          </p>
          <p style={{ ...typography.label, color: "#000000", margin: 0 }}>
            Please reset all dots to continue.
          </p>
        </>
      ) : (
        <>
          <h2
            style={{
              ...typography.heading1,
              color: "#000000",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              margin: 0,
            }}
          >
            ❌ Not Quite!
          </h2>
          <p
            style={{
              ...typography.heading2,
              color: "#000000",
              margin: 0,
              fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
            }}
          >
            Correct dots for <strong>{selectedLetter.toUpperCase()}</strong>:
          </p>
          <div style={{ margin: 0, flexShrink: 0 }}>
            <BrailleCell
              selectedLetter={selectedLetter}
              correctDots={feedback.correctDots}
            />
          </div>
          <p style={{ ...typography.label, color: "#000000", margin: 0 }}>
            Please reset all dots to try again.
          </p>
        </>
      )}
    </div>
  );
}
