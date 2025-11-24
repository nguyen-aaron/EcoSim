import React from "react";

export default function MesaSim() {
  const mesaUrl = "https://ecosim-j7dc.onrender.com";

  return (
    <div className="container">
      <div className="card" style={{ padding: 16 }}>
        <h2>Mesa Simulation</h2>
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
