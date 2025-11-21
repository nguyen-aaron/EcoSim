import React from "react";

export default function MesaSim() {
  const mesaUrl = process.env.REACT_APP_MESA_URL || "http://127.0.0.1:8522";

  return (
    <div className="container">
      <div className="card" style={{ padding: 16 }}>
        <h2>Mesa Simulation</h2>
        <div style={{ color: "var(--muted)", marginBottom: 8 }}>
          The Mesa simulation UI is embedded via an iframe. Make sure the Mesa
          server is running locally at the address below.
        </div>
        <div style={{ marginBottom: 8 }}>
          <strong>URL:</strong> {mesaUrl}
        </div>
        <div style={{ height: 600, border: "1px solid rgba(0,0,0,0.08)" }}>
          <iframe
            title="Mesa Simulation"
            src={mesaUrl}
            style={{ width: "100%", height: "100%", border: 0 }}
          />
        </div>
      </div>
    </div>
  );
}
