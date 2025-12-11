import { useState, useRef, useEffect } from "react";
import ModeSelect from "./ModeSelect";
import LetterSelect from "./LetterSelect";
import BrailleInput from "./BrailleInput";
import Feedback from "./Feedback";
import LetterInterim from "./LetterInterim";
import WordInterim from "./WordInterim";
import DotInterim from "./DotInterim";
import { brailleMap, type BrailleDot } from "../braille";

export type Mode = "letter" | "word" | "dot";

export interface FeedbackResult {
  correct: boolean;
  correctDots: BrailleDot[];
}

export default function Arduino() {
  const [data, setData] = useState("No input yet");
  const [mode, setMode] = useState<Mode | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [dotsPressed, setDotsPressed] = useState<BrailleDot[]>([]);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [showInterimScreen, setShowInterimScreen] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState(false);

  // Ref to store current state for use in the serial reading loop
  const stateRef = useRef({
    mode,
    selectedLetter,
    showInterimScreen,
    feedback,
    dotsPressed,
  });

  // Update the ref whenever state changes
  useEffect(() => {
    stateRef.current = {
      mode,
      selectedLetter,
      showInterimScreen,
      feedback,
      dotsPressed,
    };
  }, [mode, selectedLetter, showInterimScreen, feedback, dotsPressed]);

  const defaultMode: Mode = "letter";

  const reset = () => {
    setSelectedLetter(null);
    setDotsPressed([]);
    setFeedback(null);
    setShowInterimScreen(false);
    setMode(null);
  };

  const verifyDots = () => {
    if (!selectedLetter) return;

    const correctDots = brailleMap[selectedLetter.toLowerCase()];
    if (!correctDots) {
      console.error("Letter not found in brailleMap:", selectedLetter);
      return;
    }
    const isCorrect =
      correctDots.length === dotsPressed.length &&
      correctDots.every((d) => dotsPressed.includes(d));

    setFeedback({
      correct: isCorrect,
      correctDots,
    });
  };

  const handleArduinoInput = (
    input: string,
    currentMode: Mode | null,
    currentSelectedLetter: string | null,
    currentShowInterimScreen: boolean,
    currentFeedback: FeedbackResult | null,
    currentDotsPressed: BrailleDot[]
  ) => {
    const trimmed = input.trim().toUpperCase();
    console.log("Arduino input received:", { raw: input, trimmed });

    // Handle letter selection (A-Z)
    if (trimmed.length === 1 && /^[A-Z]$/.test(trimmed)) {
      console.log("Letter selection matched:", trimmed);
      if (currentMode && !currentSelectedLetter) {
        // We're waiting for letter selection
        setSelectedLetter(trimmed);
        setShowInterimScreen(true);
      }
      return;
    }

    // Handle braille dot state changes (UP/DOWN for dot 1)
    if (trimmed === "UP") {
      console.log("UP matched");
      if (
        currentMode &&
        currentSelectedLetter &&
        !currentShowInterimScreen &&
        !currentFeedback
      ) {
        // Select dot 1
        setDotsPressed((prev) => (prev.includes(1) ? prev : [...prev, 1]));
      }
      return;
    }

    if (trimmed === "DOWN") {
      console.log("DOWN matched");
      if (
        currentMode &&
        currentSelectedLetter &&
        !currentShowInterimScreen &&
        !currentFeedback
      ) {
        // Deselect dot 1
        setDotsPressed((prev) =>
          prev.includes(1) ? prev.filter((d) => d !== 1) : prev
        );
      }
      return;
    }

    // Handle Submit button (used for interim screen confirmation or braille input submission)
    if (trimmed === "SUBMIT") {
      console.log("SUBMIT matched. States:", {
        currentMode,
        currentSelectedLetter,
        currentShowInterimScreen,
        currentFeedback,
      });
      // If we're on an interim screen, confirm it
      if (
        currentMode &&
        currentSelectedLetter &&
        currentShowInterimScreen &&
        !currentFeedback
      ) {
        console.log("Confirming interim screen");
        setShowInterimScreen(false);
        return;
      }

      // If we're on braille input screen, verify the dots
      if (
        currentMode &&
        currentSelectedLetter &&
        !currentShowInterimScreen &&
        !currentFeedback
      ) {
        console.log("Verifying dots");
        // Verify dots inline
        const correctDots = brailleMap[currentSelectedLetter.toLowerCase()];
        if (!correctDots) {
          console.error(
            "Letter not found in brailleMap:",
            currentSelectedLetter
          );
          return;
        }
        const isCorrect =
          correctDots.length === currentDotsPressed.length &&
          correctDots.every((d) => currentDotsPressed.includes(d));

        setFeedback({
          correct: isCorrect,
          correctDots,
        });
        return;
      }

      // If feedback is shown, reset the flow
      if (currentFeedback) {
        console.log("Resetting flow from feedback screen");
        reset();
        return;
      }
    }
  };

  const handleModeSelect = (newMode: Mode) => {
    setSelectedLetter(null);
    setDotsPressed([]);
    setFeedback(null);
    setShowInterimScreen(false);
    setMode(newMode);
  };

  async function connectSerial() {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      setIsConnected(true);

      const reader = port.readable.getReader();
      const decoder = new TextDecoder();
      let buffer = ""; // Buffer for incomplete messages

      // Start reading loop
      (async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              setIsConnected(false);
              reader.releaseLock();
              break;
            }

            if (!value) continue; // Skip empty chunks

            const text = decoder.decode(value);
            buffer += text;

            // Replace \r\n and \r with \n for consistent line splitting
            buffer = buffer.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

            // Split by newlines and process each complete line
            const lines = buffer.split("\n");

            // Keep the last incomplete line in the buffer
            buffer = lines[lines.length - 1];

            // Process all complete lines
            for (let i = 0; i < lines.length - 1; i++) {
              const trimmed = lines[i].trim();
              if (!trimmed) continue; // Skip empty lines

              // Update display
              setData(trimmed);

              // Process the input with current state from ref
              const currentState = stateRef.current;
              try {
                handleArduinoInput(
                  trimmed,
                  currentState.mode,
                  currentState.selectedLetter,
                  currentState.showInterimScreen,
                  currentState.feedback,
                  currentState.dotsPressed
                );
              } catch (inputError) {
                console.error("Error processing Arduino input:", inputError);
              }
            }
          }
        } catch (error) {
          console.error("Serial read error:", error);
          setIsConnected(false);
          try {
            reader.releaseLock();
          } catch (e) {
            // Already released
          }
        }
      })();
    } catch (error) {
      console.error("Serial connection error:", error);
      setIsConnected(false);
    }
  }

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
        {!isConnected && (
          <button
            onClick={connectSerial}
            style={{
              padding: "1rem",
              fontSize: "1rem",
              fontWeight: "bold",
              background: "#ff6b6b",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "1rem",
            }}
          >
            Connect Arduino
          </button>
        )}
        {isConnected && (
          <div
            style={{
              padding: "1rem",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "white",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            <p style={{ margin: 0 }}>✓ Arduino Connected</p>
            <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem" }}>
              Last input: {data}
            </p>
          </div>
        )}

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
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            <LetterSelect onSelect={() => {}} />
            <p style={{ color: "white", fontSize: "1.2rem" }}>
              Waiting for Arduino letter input...
            </p>
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <BrailleInput
              selectedLetter={selectedLetter || ""}
              dotsPressed={dotsPressed}
              setDotsPressed={setDotsPressed}
              onSubmit={verifyDots}
              onBack={() => setShowInterimScreen(true)}
            />
            <p style={{ color: "white", fontSize: "1rem" }}>
              Arduino input: {data}
            </p>
          </div>
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
