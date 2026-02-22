import { useState, useRef, useEffect } from "react";
import { ArduinoDriver, type ArduinoInputEvent } from "../arduino-driver";
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
  const driverRef = useRef<ArduinoDriver | null>(null);

  // Ref to store current state for use in the input handler
  const stateRef = useRef({
    mode,
    selectedLetter,
    showInterimScreen,
    feedback,
    dotsPressed,
  });
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

  // Handles input events from ArduinoDriver and applies application business logic
  const handleArduinoInput = (event: ArduinoInputEvent) => {
    const {
      mode: currentMode,
      selectedLetter: currentSelectedLetter,
      showInterimScreen: currentShowInterimScreen,
      feedback: currentFeedback,
      dotsPressed: currentDotsPressed,
    } = stateRef.current;

    console.log("Arduino event received:", event);

    // Handle letter selection
    if (event.type === "letter") {
      if (currentMode && !currentSelectedLetter) {
        setSelectedLetter(event.value);
        setShowInterimScreen(true);
      }
      return;
    }

    // Handle dot press/release
    if (event.type === "dot") {
      if (
        currentMode &&
        currentSelectedLetter &&
        !currentShowInterimScreen &&
        !currentFeedback
      ) {
        const dot = event.dot as BrailleDot;
        if (event.pressed) {
          // Dot pressed
          setDotsPressed((prev) =>
            prev.includes(dot) ? prev : [...prev, dot],
          );
        } else {
          // Dot released
          setDotsPressed((prev) =>
            prev.includes(dot) ? prev.filter((d) => d !== dot) : prev,
          );
        }
      }
      return;
    }

    // Handle submit button
    if (event.type === "submit") {
      console.log("SUBMIT event. States:", {
        currentMode,
        currentSelectedLetter,
        currentShowInterimScreen,
        currentFeedback,
      });

      // If on interim screen, confirm it
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

      // If on braille input screen, verify the dots
      if (
        currentMode &&
        currentSelectedLetter &&
        !currentShowInterimScreen &&
        !currentFeedback
      ) {
        console.log("Verifying dots");
        const correctDots = brailleMap[currentSelectedLetter.toLowerCase()];
        if (!correctDots) {
          console.error(
            "Letter not found in brailleMap:",
            currentSelectedLetter,
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

  // Connect using ArduinoDriver
  const connectSerial = async () => {
    if (!driverRef.current) {
      driverRef.current = new ArduinoDriver({
        onInput: (event) => {
          // Display raw input for debugging
          if (event.type === "raw") {
            setData(event.value);
          } else {
            setData(
              event.type === "letter"
                ? `Letter: ${event.value}`
                : event.type === "dot"
                  ? `Dot ${event.dot}: ${event.pressed ? "pressed" : "released"}`
                  : "SUBMIT",
            );
          }
          // Apply business logic to the parsed event
          handleArduinoInput(event);
        },
        onConnect: () => setIsConnected(true),
        onDisconnect: () => setIsConnected(false),
        baudRate: 9600,
      });
    }
    try {
      await driverRef.current.connect();
    } catch (e) {
      setIsConnected(false);
    }
  };

  // Disconnect on unmount
  useEffect(() => {
    return () => {
      if (driverRef.current) {
        driverRef.current.disconnect();
      }
    };
  }, []);

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
