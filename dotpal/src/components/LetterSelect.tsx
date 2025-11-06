import { useEffect } from "react";

interface Props {
  onSelect: (letter: string) => void;
}

export default function LetterSelect({ onSelect }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      if (key >= "a" && key <= "z") {
        onSelect(key);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onSelect]);

  return <h2>Press a letter (A–Z)</h2>;
}
