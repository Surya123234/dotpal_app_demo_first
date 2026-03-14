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

  const getRandomLetter = (): string => {
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");
    return letters[Math.floor(Math.random() * letters.length)];
  };

  const selectRandomLetter = () => {
    const newLetter = getRandomLetter();
    setSelectedLetter(newLetter);
    setDotsPressed([]);
    setFeedback(null);
    setShowInterimScreen(true);
  };

  const tryAgain = () => {
    setDotsPressed([]);
    setFeedback(null);
    setShowInterimScreen(false);
  };

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

  // Initialize driver on mount and auto-connect; keep connection until unplugged
  useEffect(() => {
    const driver = new ArduinoDriver({
      onInput: handleArduinoInput,
      onConnect: () => setIsConnected(true),
      onDisconnect: () => setIsConnected(false),
      baudRate: 9600,
    });
    driverRef.current = driver;

    // Attempt to auto-connect; if permissions are needed the browser will prompt
    driver.connect().catch(() => {
      /* ignore connection errors for now */
    });

    // Intentionally do not call disconnect on unmount. Keep the port open until
    // the device is unplugged so the driver maintains a persistent connection.
  }, []);
  const goHome = () => {
    // Reset UI state but keep the Arduino driver connection alive
    reset();
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#000000",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          background: "#ffffff",
          borderBottom: "3px solid #000000",
          padding: "0.8rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div>
          <h1
            style={{
              ...typography.heading1,
              color: "#000000",
              margin: 0,
              fontSize: "1.8rem",
            }}
          >
            DotPal
          </h1>
        </div>
        <button
          onClick={() => driverRef.current?.connect()}
          style={{
            ...buttonStyles.secondary,
            fontSize: "0.9rem",
            padding: "0.6rem 1.2rem",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f0f0f0";
            e.currentTarget.style.transform = "translate(-1px, -1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {isConnected ? "✓ DotPal Connected" : "Connect DotPal"}
        </button>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          display: "flex",
          flex: 1,
          width: "100%",
          gap: 0,
          overflow: "hidden",
        }}
      >
        {/* Left Sidebar - Mode Selection */}
        <div
          style={{
            background: "#ffffff",
            borderRight: "3px solid #000000",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "stretch",
            minWidth: "280px",
            width: "clamp(240px, 22vw, 300px)",
            overflowY: "auto",
            gap: spacing.md,
          }}
        >
          {/* Mode indicator during flow */}
          {mode && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: spacing.sm,
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Current Mode
              </div>
              <div
                style={{
                  background: "#000000",
                  color: "#ffffff",
                  padding: "0.8rem 1rem",
                  borderRadius: "0px",
                  textAlign: "center",
                  fontWeight: "900",
                  fontSize: "1.1rem",
                  border: "2px solid #000000",
                }}
              >
                {mode === "letter"
                  ? "📝 Letter"
                  : mode === "word"
                    ? "🍎 Word"
                    : "⚪ Dot"}
              </div>
            </div>
          )}
          {!mode && (
            <ModeSelect mode={defaultMode} onSelect={handleModeSelect} />
          )}
          {mode && (
            <>
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Switch Mode
              </div>
              <ModeSelect
                mode={mode}
                onSelect={handleModeSelect}
                showOnlyOtherModes={true}
              />
            </>
          )}
        </div>

        {/* Right Main Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: spacing.xl,
            padding: "clamp(1.5rem, 5vw, 3rem)",
            overflowY: "auto",
            background: "#000000",
          }}
        >
          {/* Mode selection prompt */}
          {!mode && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: spacing.xl,
              }}
            >
              <p
                style={{
                  ...typography.heading2,
                  color: "#ffffff",
                  fontSize: "clamp(1.5rem, 4vw, 2rem)",
                }}
              >
                Select a learning mode to begin
              </p>
            </div>
          )}

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
                  ...typography.heading2,
                  color: "#ffffff",
                  fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                }}
              >
                Waiting for letter selection...
              </p>
            </div>
          )}

          {/* Interim screens for each mode */}
          {mode && selectedLetter && showInterimScreen && !feedback && (
            <Interim
              mode={mode}
              selectedLetter={selectedLetter}
              onAudioEnd={() => setShowInterimScreen(false)}
            />
          )}

          {/* Braille input for all modes */}
          {mode && selectedLetter && !showInterimScreen && !feedback && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: spacing.lg,
                maxWidth: "clamp(600px, 85vw, 1000px)",
                width: "100%",
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
              onTryAgain={tryAgain}
              onNext={selectRandomLetter}
              selectedMode={mode || ""}
            />
          )}
        </div>
      </div>
    </div>
  );
}
