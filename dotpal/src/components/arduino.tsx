import { useState } from "react";

export default function App() {
  const [data, setData] = useState("No input yet");

  async function connectSerial() {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const reader = port.readable.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);

      // THIS updates the UI
      setData(text.trim());
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={connectSerial}>Connect to Arduino</button>

      <h2>Arduino Button Status:</h2>
      <div
        style={{
          padding: "20px",
          fontSize: "24px",
          background: "#040101ff",
          borderRadius: "8px",
        }}
      >
        {data}
      </div>
    </div>
  );
}
