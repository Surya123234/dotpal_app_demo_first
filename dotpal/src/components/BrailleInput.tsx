import { useEffect } from "react";
import { type BrailleDot, keyToDot } from "../braille";

interface Props {
  selectedLetter: string;
  dotsPressed: BrailleDot[];
  setDotsPressed: (dots: BrailleDot[]) => void;
  onSubmit: () => void;
}

export default function BrailleInput({
  dotsPressed,
  setDotsPressed,
  onSubmit,
}: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const dot = keyToDot[e.key];

      if (dot) {
        // ✅ default beep
        const audio = new Audio("/audios/button_select.mp3");
        audio.play().catch(() => {
          /* ignore play errors (autoplay policy, etc.) */
        });

        if (!dotsPressed.includes(dot)) {
          setDotsPressed([...dotsPressed, dot]);
        }
      }

      if (e.key === "Enter") onSubmit();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dotsPressed, setDotsPressed, onSubmit]);

  return (
    <div>
      <h2>Enter Braille dots using: [ ] ; ' . /</h2>
      <p>Dots pressed: {dotsPressed.join(", ")}</p>
      <button onClick={onSubmit}>Submit</button>
    </div>
  );
}
