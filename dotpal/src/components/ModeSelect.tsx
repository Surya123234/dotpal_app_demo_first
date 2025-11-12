import type { Mode } from "../App";

interface Props {
  onSelect: (mode: Mode) => void;
  mode: Mode; // Added mode prop
}

export default function ModeSelect({ onSelect }: Props) {
  const handleModeSelect = (mode: Mode) => {
    onSelect(mode);
    // Logic to display the corresponding dialogue and screen
  };

  return (
    <div>
      <h2>Select Mode</h2>
      <button onClick={() => handleModeSelect("letter")}>Letter Mode</button>
      <button onClick={() => handleModeSelect("word")}>Word Mode</button>
      <button onClick={() => handleModeSelect("dot")}>Dot # Mode</button>
    </div>
  );
}
