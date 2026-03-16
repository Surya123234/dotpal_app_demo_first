import { useEffect } from "react";
import { supabase } from "../supabase";

interface Props {}

export default function LetterSelect({}: Props) {
  useEffect(() => {
    const audioData = supabase.storage
      .from("media")
      .getPublicUrl(`audio/select_letter.mp3`);
    const audio = new Audio(audioData.data.publicUrl);
    audio.play().catch(() => {
      /* ignore play errors */
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "2rem",
        background: "white",
        borderRadius: "0px",
        boxShadow: "0 0 0 4px black",
        minWidth: "280px",
        width: "min(40vw, 480px)",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "2.5rem",
          color: "black",
          margin: 0,
          fontWeight: "bold",
        }}
      >
        Select a letter using DotPal
      </h2>
      <p
        style={{
          fontSize: "1.8rem",
          color: "black",
          margin: 0,
          fontWeight: "bold",
        }}
      ></p>
    </div>
  );
}
