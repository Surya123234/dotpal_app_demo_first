import { useState, useRef, useEffect } from "react";
import { ArduinoDriver, type ArduinoInputEvent } from "../arduino-driver";
import ModeSelect from "./ModeSelect";
import LetterSelect from "./LetterSelect";
import BrailleInput from "./BrailleInput";
import Feedback from "./Feedback";
import Interim from "./Interim";
import { brailleMap, type BrailleDot } from "../braille";
import { spacing, typography, buttonStyles } from "../styles/theme";
import { supabase } from "../supabase";

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
  const [waitingForReset, setWaitingForReset] = useState<boolean>(false);
  const [pendingLetterSelection, setPendingLetterSelection] = useState<
    string | null
  >(null);
  const driverRef = useRef<ArduinoDriver | null>(null);
  const resetAudioRef = useRef<HTMLAudioElement | null>(null);
  const interimAudioRef = useRef<HTMLAudioElement | null>(null);
  const pendingModeRef = useRef<Mode | null>(null);

  // Ref to store current state for use in the input handler
  const stateRef = useRef({
    mode,
    selectedLetter,
    showInterimScreen,
    feedback,
    dotsPressed,
    waitingForReset,
    pendingLetterSelection,
  });

  useEffect(() => {
    stateRef.current = {
      mode,
      selectedLetter,
      showInterimScreen,
      feedback,
      dotsPressed,
      waitingForReset,
      pendingLetterSelection,
    };
  }, [
    mode,
    selectedLetter,
    showInterimScreen,
    feedback,
    dotsPressed,
    waitingForReset,
    pendingLetterSelection,
  ]);

  const defaultMode: Mode = "letter";

  const reset = () => {
    setSelectedLetter(null);
    setDotsPressed([]);
    setFeedback(null);
    setShowInterimScreen(false);
    setMode(null);
    setWaitingForReset(false);
    setPendingLetterSelection(null);
  };

  const playResetAudio = () => {
    // Don't overlap: if reset audio is already playing, skip
    const existing = resetAudioRef.current;
    if (existing && !existing.paused && !existing.ended) return;

    const audioData = supabase.storage
      .from("media")
      .getPublicUrl(`audio/reset_dots.mp3`);
    const audio = new Audio(audioData.data.publicUrl);
    resetAudioRef.current = audio;
    audio.play().catch(() => {
      /* ignore play errors */
    });
  };

  const stopResetAudio = () => {
    if (resetAudioRef.current) {
      resetAudioRef.current.pause();
      resetAudioRef.current.currentTime = 0;
      resetAudioRef.current = null;
    }
  };

  const checkDotsReset = (currentDotsPressed: BrailleDot[]) => {
    return currentDotsPressed.length === 0;
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
      waitingForReset: currentWaitingForReset,
    } = stateRef.current;

    // Handle letter selection
    if (event.type === "letter") {
      // If waiting for reset, check if dots are reset
      if (currentWaitingForReset) {
        if (checkDotsReset(currentDotsPressed)) {
          // Dots are reset, proceed with letter selection
          stopResetAudio();
          setWaitingForReset(false);
          if (currentMode && !currentSelectedLetter) {
            setSelectedLetter(event.value);
            setShowInterimScreen(true);
          } else if (currentMode) {
            // Allow selecting new letter after reset
            setSelectedLetter(event.value);
            setDotsPressed([]);
            setFeedback(null);
            setShowInterimScreen(true);
          }
        } else {
          // Dots not reset, play reset audio again
          playResetAudio();
        }
        return;
      }

      // If currently in a flow (has mode and selectedLetter), check if reset is needed
      if (currentMode && currentSelectedLetter && !currentWaitingForReset) {
        if (checkDotsReset(currentDotsPressed)) {
          // Dots already clear — go straight to the new letter
          setSelectedLetter(event.value);
          setDotsPressed([]);
          setFeedback(null);
          setShowInterimScreen(true);
        } else {
          // Dots not clear — play reset audio and wait; user must press the letter again
          playResetAudio();
          stateRef.current.waitingForReset = true;
          setWaitingForReset(true);
        }
        return;
      }

      // Normal letter selection when no mode/letter selected
      if (currentMode && !currentSelectedLetter) {
        if (checkDotsReset(currentDotsPressed)) {
          setSelectedLetter(event.value);
          setShowInterimScreen(true);
        } else {
          // Dots raised — require reset before entering a letter
          playResetAudio();
          stateRef.current.waitingForReset = true;
          setWaitingForReset(true);
        }
      }
      return;
    }

    // Handle dot press/release
    if (event.type === "dot") {
      // If waiting for reset, check if this completes the reset
      if (currentWaitingForReset) {
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
        // Check if dots are now reset
        setTimeout(() => {
          const updatedDots = stateRef.current.dotsPressed;
          const latestFeedback = stateRef.current.feedback;
          if (checkDotsReset(updatedDots)) {
            stopResetAudio();
            setWaitingForReset(false);
            // If a mode switch was pending (triggered from interim screen), apply it now
            if (pendingModeRef.current !== null) {
              const pendingMode = pendingModeRef.current;
              pendingModeRef.current = null;
              setMode(pendingMode);
              setSelectedLetter(null);
              setDotsPressed([]);
              setFeedback(null);
              setShowInterimScreen(false);
              setPendingLetterSelection(null);
              return;
            }
            if (latestFeedback?.correct) {
              // Correct feedback: go back to letter selection so user can pick a new letter
              setSelectedLetter(null);
              setDotsPressed([]);
              setFeedback(null);
              setShowInterimScreen(false);
            } else if (latestFeedback && !latestFeedback.correct) {
              // Incorrect feedback: go back to braille input to try again
              setDotsPressed([]);
              setFeedback(null);
              setShowInterimScreen(false);
            }
            // No feedback case: just clear waitingForReset so user can press the letter again
          }
        }, 100);
        return;
      }

      // Normal dot input during braille input phase
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

      // Also track dot presses during interim screen
      if (
        currentMode &&
        currentSelectedLetter &&
        currentShowInterimScreen &&
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

      // Also track dot presses on home screen (letter selection)
      if (currentMode && !currentSelectedLetter && !currentFeedback) {
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
      // If waiting for reset, check if dots are reset
      if (currentWaitingForReset) {
        if (checkDotsReset(currentDotsPressed)) {
          stopResetAudio();
          setWaitingForReset(false);
          if (currentFeedback) {
            // After feedback, allow trying again / go back to letter selection
            setDotsPressed([]);
            setFeedback(null);
            setShowInterimScreen(false);
          }
        } else {
          // Dots not reset, play reset audio again
          playResetAudio();
        }
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
    // If currently in a flow, require reset first
    if (mode && selectedLetter && !waitingForReset) {
      // Stop any interim audio that may be playing
      if (interimAudioRef.current) {
        interimAudioRef.current.pause();
        interimAudioRef.current.currentTime = 0;
        interimAudioRef.current = null;
      }

      const switchMode = () => {
        setMode(newMode);
        setSelectedLetter(null);
        setDotsPressed([]);
        setFeedback(null);
        setShowInterimScreen(false);
        setWaitingForReset(false);
        setPendingLetterSelection(null);
      };

      if (checkDotsReset(dotsPressed)) {
        // Dots already clear — switch immediately, no reset audio needed
        switchMode();
      } else {
        // Dots are raised — play reset audio, then switch mode after it ends
          pendingModeRef.current = newMode;
        const audioData = supabase.storage
          .from("media")
          .getPublicUrl(`audio/reset_dots.mp3`);
        const audio = new Audio(audioData.data.publicUrl);
        resetAudioRef.current = audio;
        setWaitingForReset(true);
        audio.onended = () => {
          // Only switch if the dot-reset handler hasn't already consumed pendingModeRef
          if (pendingModeRef.current !== null) {
            pendingModeRef.current = null;
            switchMode();
          }
        };
        audio.play().catch(() => {
          /* ignore play errors */
        });
      }
      return;
    }

    setSelectedLetter(null);
    setDotsPressed([]);
    setFeedback(null);
    setShowInterimScreen(false);
    setMode(newMode);
  };

  // Play welcome audio sequence on first load: select_game → reset_dots
  useEffect(() => {
    const selectGameUrl = supabase.storage
      .from("media")
      .getPublicUrl("audio/select_game.mp3").data.publicUrl;
    const resetDotsUrl = supabase.storage
      .from("media")
      .getPublicUrl("audio/reset_dots.mp3").data.publicUrl;

    const selectGameAudio = new Audio(selectGameUrl);
    selectGameAudio.onended = () => {
      const resetAudio = new Audio(resetDotsUrl);
      resetAudio.play().catch(() => {
        /* ignore play errors */
      });
    };
    selectGameAudio.play().catch(() => {
      /* ignore play errors */
    });
  }, []);

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
            alignItems: feedback || showInterimScreen ? "stretch" : "center",
            justifyContent:
              feedback || showInterimScreen ? "stretch" : "center",
            gap: feedback || showInterimScreen ? 0 : spacing.xl,
            padding:
              feedback || showInterimScreen ? 0 : "clamp(1.5rem, 5vw, 3rem)",
            overflowY: "hidden",
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
              onAudioStart={(audio) => {
                interimAudioRef.current = audio;
              }}
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
            <div style={{ flex: 1, display: "flex", alignSelf: "stretch" }}>
              <Feedback
                feedback={feedback}
                selectedLetter={selectedLetter || ""}
                selectedMode={mode || ""}
                onAudioEnd={() => {
                  playResetAudio();
                  setWaitingForReset(true);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
