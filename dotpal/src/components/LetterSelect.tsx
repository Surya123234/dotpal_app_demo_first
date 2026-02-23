interface Props {}

export default function LetterSelect({}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "2rem",
        background: "white",
        borderRadius: "15px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", color: "#333", margin: 0 }}>
        📚 Select a Letter
      </h2>
      <p style={{ fontSize: "0.95rem", color: "#666", margin: 0 }}>
        (Using Arduino Input)
      </p>
    </div>
  );
}
