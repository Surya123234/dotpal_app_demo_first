import { useEffect, useState } from "react";
import { type BrailleDot, keyToDot } from "../braille";
import BrailleCell from "./BrailleCell";

interface Props {
  selectedLetter: string;
  dotsPressed: BrailleDot[];
  setDotsPressed: (dots: BrailleDot[]) => void;
  onSubmit: () => void;
  mode: "letter" | "word" | "dot";
}

export default function BrailleInput({
  selectedLetter,
  dotsPressed,
  setDotsPressed,
  onSubmit,
  mode,
}: Props) {
  const [inputBuffer, setInputBuffer] = useState<string>("");

  const toggleDot = (dot: BrailleDot) => {
    if (dotsPressed.includes(dot)) {
      setDotsPressed(dotsPressed.filter((d) => d !== dot));
    } else {
      setDotsPressed([...dotsPressed, dot]);
    }
    // Play button select sound
    const audio = new Audio("/audios/button_select.mp3");
    audio.play().catch(() => {
      /* ignore play errors (autoplay policy, etc.) */
    });
  };

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const dot = keyToDot[e.key];

      if (dot) {
        toggleDot(dot);
      }

      if (e.key === "Enter") {
        if (mode === "word") {
          // Submit the current input buffer
          onSubmit();
          setInputBuffer(""); // Clear buffer after submit
        } else {
          onSubmit();
        }
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dotsPressed, setDotsPressed, onSubmit, mode]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      <h2>Enter Braille dots</h2>
      <BrailleCell
        dotsPressed={dotsPressed}
        onDotToggle={toggleDot}
        selectedLetter={selectedLetter}
      />
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={onSubmit}
          style={{ padding: "0.75rem 2rem", fontSize: "1.1rem" }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
