import { useEffect } from "react";
import { type BrailleDot } from "../braille";
import BrailleCell from "./BrailleCell";
import { boxStyles, buttonStyles, typography, spacing } from "../styles/theme";
import { supabase } from "../supabase";

let activeEnterBrailleAudio: HTMLAudioElement | null = null;

interface Props {
  selectedLetter: string;
  dotsPressed: BrailleDot[];
  setDotsPressed: (dots: BrailleDot[]) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function BrailleInput({
  selectedLetter,
  dotsPressed,
  setDotsPressed,
  onSubmit,
  onBack,
}: Props) {
  useEffect(() => {
    if (activeEnterBrailleAudio) {
      activeEnterBrailleAudio.pause();
      activeEnterBrailleAudio.currentTime = 0;
    }

    const url = supabase.storage
      .from("media")
      .getPublicUrl("audio/enter_braille.mp3").data.publicUrl;
    const audio = new Audio(url);
    activeEnterBrailleAudio = audio;
    audio.play().catch(() => {
      /* ignore play errors */
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
      if (activeEnterBrailleAudio === audio) {
        activeEnterBrailleAudio = null;
      }
    };
  }, []);

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

  return (
    <div
      style={{
        ...boxStyles.card,
        maxWidth: "700px",
        width: "100%",
        position: "relative",
      }}
    >
      <button
        onClick={onBack}
        style={{
          ...buttonStyles.secondary,
          position: "absolute",
          top: spacing.md,
          left: spacing.md,
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
        ← Back
      </button>
      <h2
        style={{
          ...typography.heading2,
          color: "#000000",
          margin: `0 0 0rem 0`,
          paddingTop: spacing.md,
          textAlign: "center",
          fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
        }}
      >
        Enter Braille for{" "}
        <span
          style={{
            fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
            fontWeight: "900",
            color: "#000000",
          }}
        >
          {selectedLetter.toUpperCase()}
        </span>
      </h2>
      <BrailleCell
        dotsPressed={dotsPressed}
        onDotToggle={toggleDot}
        selectedLetter={selectedLetter}
      />
      <div style={{ display: "flex", gap: spacing.md }}>
        <button
          onClick={onSubmit}
          style={buttonStyles.primary()}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate(-2px, -2px)";
            e.currentTarget.style.boxShadow = "6px 6px 0px rgba(0,0,0,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "4px 4px 0px rgba(0,0,0,0.3)";
          }}
        >
          ✓ Submit
        </button>
      </div>
    </div>
  );
}
