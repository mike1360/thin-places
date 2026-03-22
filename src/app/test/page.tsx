"use client";

import { useState, useEffect } from "react";

export default function TestPage() {
  const [status, setStatus] = useState("Waiting for hydration...");
  const [count, setCount] = useState(0);

  useEffect(() => {
    setStatus("Client JS is working!");
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "monospace", color: "white", background: "#0a0a0a", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 24 }}>Thin Places - Test</h1>
      <p style={{ color: status.includes("working") ? "#44ff44" : "#ffaa00" }}>{status}</p>
      <button
        onClick={() => setCount(c => c + 1)}
        style={{ marginTop: 20, padding: "10px 20px", background: "#333", color: "white", border: "none", borderRadius: 8 }}
      >
        Tapped {count} times
      </button>
    </div>
  );
}
