import { useState } from "react";
import ModeSelect from "./components/ModeSelect";
import LetterSelect from "./components/LetterSelect";
import BrailleInput from "./components/BrailleInput";
import Feedback from "./components/Feedback";
import { brailleMap, type BrailleDot } from "./braille";

export type Mode = "letter" | "word" | "dot";

export interface FeedbackResult {
  correct: boolean;
  correctDots: BrailleDot[];
}

export default function App() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [dotsPressed, setDotsPressed] = useState<BrailleDot[]>([]);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);

  const defaultMode: Mode = "letter"; // Set defaultMode to a valid Mode type

  const reset = () => {
    setSelectedLetter(null);
    setDotsPressed([]);
    setFeedback(null);
    setMode(null); // Reset mode when resetting
  };

  const verifyDots = () => {
    if (!selectedLetter) return;

    const correctDots = brailleMap[selectedLetter];
    const isCorrect =
      correctDots.length === dotsPressed.length &&
      correctDots.every((d) => dotsPressed.includes(d));

    setFeedback({
      correct: isCorrect,
      correctDots,
    });
  };

  return (
    <div style={{ padding: 40 }}>
      {!mode && <ModeSelect mode={defaultMode} onSelect={setMode} />}
      {mode && <ModeSelect mode={mode} onSelect={setMode} />}
      {mode === "letter" && !selectedLetter && (
        <LetterSelect onSelect={setSelectedLetter} />
      )}
      {mode === "letter" && selectedLetter && !feedback && (
        <BrailleInput
          mode={mode} // Added mode prop
          selectedLetter={selectedLetter || ""} // Handle null case
          dotsPressed={dotsPressed}
          setDotsPressed={setDotsPressed}
          onSubmit={verifyDots}
        />
      )}
      {feedback && (
        <Feedback
          feedback={feedback}
          selectedLetter={selectedLetter || ""} // Handle null case
          reset={reset}
          selectedMode={mode || ""} // Handle null case
        />
      )}
    </div>
  );
}
