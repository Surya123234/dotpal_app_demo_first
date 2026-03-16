import { useEffect, useState } from "react";
import { brailleMap, type BrailleDot } from "../braille";
import BrailleCell from "./BrailleCell";
import { typography } from "../styles/theme";
import { supabase } from "../supabase";

interface Props {
  mode: "letter" | "word" | "dot";
  selectedLetter: string;
  onAudioEnd?: () => void;
}

export default function Interim({ mode, selectedLetter, onAudioEnd }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  // Load audio based on mode
  useEffect(() => {
    const audioData = supabase.storage
      .from("media")
      .getPublicUrl(`audio/${mode}_mode_${selectedLetter.toLowerCase()}.mp3`);
    const audio = new Audio(audioData.data.publicUrl);
    audio.addEventListener("ended", () => {
      onAudioEnd?.();
    });
    audio.play().catch((e) => {
      /* ignore play errors */
      console.log("Audio play error:", e);
    });
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [selectedLetter, mode, onAudioEnd]);

  // Preload image for word mode
  useEffect(() => {
    if (mode === "word") {
      setImageLoaded(false);
      const imageData = supabase.storage
        .from("media")
        .getPublicUrl(
          `images/word_mode_picture_${selectedLetter.toLowerCase()}.jpeg`,
        );
      setImageUrl(imageData.data.publicUrl);
    }
  }, [selectedLetter, mode]);

  const correctDots = brailleMap[selectedLetter.toLowerCase()] || [];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: mode === "word" ? "row" : "column",
        alignItems: mode === "word" ? "stretch" : "center",
        justifyContent: mode === "word" ? "flex-start" : "center",
        gap: mode === "word" ? "clamp(0.5rem, 1vw, 1rem)" : "0.2rem",
        padding:
          mode === "word"
            ? "clamp(0.5rem, 1vw, 1rem)"
            : "clamp(1.5rem, 3vw, 2.5rem)",
        background: "#ffffff",
        borderRadius: "0px",
        boxShadow: "0 0 0 2px #000000",
        flex: 1,
        alignSelf: "stretch",
        overflow: "hidden",
      }}
    >
      {/* Letter display */}
      <div
        style={{
          fontSize:
            mode === "dot"
              ? "clamp(2rem, 5vw, 3rem)"
              : mode === "word"
                ? "clamp(3rem, 8vw, 8rem)"
                : "clamp(8rem, 20vw, 14rem)",
          fontWeight: "900",
          color: "#000000",
          textShadow: "none",
          animation: mode === "letter" ? "none" : "pulse 2s infinite",
          margin: 0,
          flexShrink: 0,
          flex: mode === "word" ? "0 0 auto" : undefined,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {mode === "letter" && selectedLetter.toUpperCase()}
        {mode === "word" && selectedLetter.toUpperCase()}
      </div>

      {/* Word mode: big image to the right */}
      {mode === "word" && (
        <div
          style={{
            flex: 1,
            minWidth: 0,
            maxWidth: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: imageLoaded ? "transparent" : "#f0f0f0",
          }}
        >
          <img
            src={imageUrl}
            alt={selectedLetter}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: imageLoaded ? 1 : 0,
              transition: "opacity 0.2s ease-in",
            }}
          />
        </div>
      )}

      {/* Mode-specific content */}
      {mode === "dot" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.1rem",
            width: "100%",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              ...typography.heading2,
              color: "#000000",
              textShadow: "none",
              margin: 0,
              textAlign: "center",
              fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
            }}
          >
            Braille for{" "}
            <span
              style={{
                fontWeight: "900",
                fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                color: "#000000",
              }}
            >
              {selectedLetter.toUpperCase()}
            </span>
          </h2>
          <div
            style={{
              width: "100%",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <BrailleCell
              selectedLetter={selectedLetter}
              correctDots={correctDots as BrailleDot[]}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
