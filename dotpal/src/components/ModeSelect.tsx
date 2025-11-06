import type { Mode } from "../App";

interface Props {
  onSelect: (mode: Mode) => void;
}

export default function ModeSelect({ onSelect }: Props) {
  return (
    <div>
      <h2>Select Mode</h2>
      <button onClick={() => onSelect("letter")}>Letter Mode</button>
      <button onClick={() => onSelect("word")}>Word Mode</button>
      <button onClick={() => onSelect("dot")}>Dot # Mode</button>
    </div>
  );
}
