import { useState, useRef, useEffect } from "react";
import { ArduinoDriver, type ArduinoInputEvent } from "../arduino-driver";
import ModeSelect from "./ModeSelect";
import LetterSelect from "./LetterSelect";
import BrailleInput from "./BrailleInput";
import Feedback from "./Feedback";
import Interim from "./Interim";
import { brailleMap, type BrailleDot } from "../braille";
import {
  colorSchemes,
  boxStyles,
  spacing,
  typography,
  buttonStyles,
} from "../styles/theme";

export type Mode = "letter" | "word" | "dot";

export interface FeedbackResult {
  correct: boolean;
  correctDots: BrailleDot[];
}

export default function BrailleApp() {
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

  // Handle input events from ArduinoDriver
  const handleArduinoInput = (event: ArduinoInputEvent) => {
    const {
      mode: currentMode,
      selectedLetter: currentSelectedLetter,
      showInterimScreen: currentShowInterimScreen,
      feedback: currentFeedback,
      dotsPressed: currentDotsPressed,
    } = stateRef.current;

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
          setDotsPressed((prev) =>
            prev.includes(dot) ? prev : [...prev, dot],
          );
        } else {
          setDotsPressed((prev) =>
            prev.includes(dot) ? prev.filter((d) => d !== dot) : prev,
          );
        }
      }
      return;
    }

    // Handle submit button
    if (event.type === "submit") {
      // If on interim screen, confirm it
      if (
        currentMode &&
        currentSelectedLetter &&
        currentShowInterimScreen &&
        !currentFeedback
      ) {
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

  // Initialize driver on mount but don't auto-connect
  useEffect(() => {
    const driver = new ArduinoDriver({
      onInput: handleArduinoInput,
      onConnect: () => setIsConnected(true),
      onDisconnect: () => setIsConnected(false),
      baudRate: 9600,
    });
    driverRef.current = driver;
  }, []);

  const handleConnectArduino = async () => {
    if (!driverRef.current) return;

    try {
      await driverRef.current.connect();
    } catch (error) {
      console.error("Failed to connect to Arduino:", error);
      alert("Failed to connect to Arduino. Please try again.");
    }
  };
  const goHome = () => {
    // Reset UI state but keep the Arduino driver connection alive
    reset();
  };

  return (
    <div
      style={{
        height: "100vh",
        background: `linear-gradient(135deg, ${colorSchemes.letter.primary} 0%, ${colorSchemes.letter.secondary} 100%)`,
        padding: spacing.lg,
        margin: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        overflow: "hidden",
        gap: spacing.xl,
      }}
    >
      {/* Sidebar Navigation */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing.sm,
          minWidth: "250px",
          height: "fit-content",
        }}
      >
        {isConnected && (
          <div style={boxStyles.statusIndicator(true)}>
            <p style={{ ...typography.label, margin: 0, fontWeight: "bold" }}>
              ✓ Arduino Connected
            </p>
          </div>
        )}

        {!isConnected && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: spacing.sm,
            }}
          >
            <div style={boxStyles.statusIndicator(false, true)}>
              <p style={{ ...typography.label, margin: 0, fontWeight: "bold" }}>
                ⏳ Arduino Disconnected
              </p>
            </div>
            <button
              onClick={handleConnectArduino}
              style={{
                ...buttonStyles.primary,
                backgroundColor: colorSchemes.word.primary,
              }}
            >
              Select Arduino Port
            </button>
          </div>
        )}

        {!mode && <ModeSelect mode={defaultMode} onSelect={handleModeSelect} />}
        {mode && <ModeSelect mode={mode} onSelect={handleModeSelect} />}

        <div style={{ marginTop: spacing.md }}>
          <button onClick={goHome} style={buttonStyles.secondary}>
            Home / Restart
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: spacing.lg,
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
              gap: spacing.lg,
            }}
          >
            <LetterSelect />
            <p
              style={{
                ...typography.heading1,
                color: "white",
              }}
            >
              Waiting for Arduino letter input...
            </p>
          </div>
        )}

        {/* Interim screens for each mode */}
        {mode && selectedLetter && showInterimScreen && !feedback && (
          <Interim mode={mode} selectedLetter={selectedLetter} />
        )}

        {/* Braille input for all modes */}
        {mode && selectedLetter && !showInterimScreen && !feedback && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <BrailleInput
              selectedLetter={selectedLetter || ""}
              dotsPressed={dotsPressed}
              setDotsPressed={setDotsPressed}
              onSubmit={verifyDots}
              onBack={() => setShowInterimScreen(true)}
            />
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
