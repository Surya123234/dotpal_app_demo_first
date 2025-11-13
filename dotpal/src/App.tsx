import { useState } from "react";
import ModeSelect from "./components/ModeSelect";
import LetterSelect from "./components/LetterSelect";
import BrailleInput from "./components/BrailleInput";
import Feedback from "./components/Feedback";
import LetterInterim from "./components/LetterInterim";
import WordInterim from "./components/WordInterim";
import DotInterim from "./components/DotInterim";
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
  const [showInterimScreen, setShowInterimScreen] = useState<boolean>(false);

  const defaultMode: Mode = "letter"; // Set defaultMode to a valid Mode type

  const reset = () => {
    setSelectedLetter(null);
    setDotsPressed([]);
    setFeedback(null);
    setShowInterimScreen(false);
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

  const handleLetterSelect = (letter: string) => {
    setSelectedLetter(letter);
    setShowInterimScreen(true); // Show interim screen when letter is selected
  };

  const handleModeSelect = (newMode: Mode) => {
    // Reset the flow when switching modes
    setSelectedLetter(null);
    setDotsPressed([]);
    setFeedback(null);
    setShowInterimScreen(false);
    setMode(newMode);
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "2rem",
        margin: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        overflow: "hidden",
        gap: "3rem",
      }}
    >
      {/* Sidebar Navigation */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          minWidth: "250px",
          height: "fit-content",
        }}
      >
        {!mode && <ModeSelect mode={defaultMode} onSelect={handleModeSelect} />}
        {mode && <ModeSelect mode={mode} onSelect={handleModeSelect} />}
      </div>

      {/* Main Content Area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          flex: 1,
          height: "100%",
          maxWidth: "800px",
        }}
      >
        {/* Letter select for all modes */}
        {mode && !selectedLetter && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LetterSelect onSelect={handleLetterSelect} />
          </div>
        )}

        {/* Interim screens for each mode */}
        {mode === "letter" &&
          selectedLetter &&
          showInterimScreen &&
          !feedback && (
            <LetterInterim
              selectedLetter={selectedLetter}
              onConfirm={() => setShowInterimScreen(false)}
            />
          )}

        {mode === "word" &&
          selectedLetter &&
          showInterimScreen &&
          !feedback && (
            <WordInterim
              selectedLetter={selectedLetter}
              onConfirm={() => setShowInterimScreen(false)}
            />
          )}

        {mode === "dot" && selectedLetter && showInterimScreen && !feedback && (
          <DotInterim
            selectedLetter={selectedLetter}
            onConfirm={() => setShowInterimScreen(false)}
          />
        )}

        {/* Braille input for all modes */}
        {mode && selectedLetter && !showInterimScreen && !feedback && (
          <BrailleInput
            mode={mode}
            selectedLetter={selectedLetter || ""}
            dotsPressed={dotsPressed}
            setDotsPressed={setDotsPressed}
            onSubmit={verifyDots}
            onBack={() => setShowInterimScreen(true)}
          />
        )}

        {feedback && (
          <Feedback
            feedback={feedback}
            selectedLetter={selectedLetter || ""}
            reset={reset}
            selectedMode={mode || ""}
          />
        )}
      </div>
    </div>
  );
}
