import React from "react";

const STATUS_STYLES = {
  invasive: {
    background: "rgba(239, 71, 111, 0.1)",
    color: "#ef476f",
  },
  nonnative: {
    background: "rgba(255, 149, 0, 0.12)",
    color: "#ff9500",
  },
  native: {
    background: "rgba(76, 175, 80, 0.12)",
    color: "#4caf50",
  },
  endangered: {
    background: "rgba(255, 20, 20, 0.12)",
    color: "#cc0000",
  },
  "critically endangered": {
    background: "rgba(171, 0, 0, 0.15)",
    color: "#8b0000",
  },
  threatened: {
    background: "rgba(255, 165, 0, 0.12)",
    color: "#d88a00",
  },
  vulnerable: {
    background: "rgba(255, 205, 86, 0.12)",
    color: "#c89b00",
  },
  protected: {
    background: "rgba(90, 169, 230, 0.12)",
    color: "#4a90e2",
  },
  "extinct in the wild": {
    background: "rgba(130, 130, 130, 0.15)",
    color: "#555",
  },
  extinct: {
    background: "rgba(90, 90, 90, 0.2)",
    color: "#222",
  },
  "keystone species": {
    background: "rgba(46, 196, 182, 0.12)",
    color: "#2ec4b6",
  },
  "apex predator": {
    background: "rgba(147, 51, 234, 0.12)",
    color: "#9333ea",
  },
  default: {
    background: "rgba(90, 169, 230, 0.1)",
    color: "#5aa9e6",
  },
};


function getStatusStyle(status) {
  const key = status.toLowerCase();
  return STATUS_STYLES[key] || STATUS_STYLES.default;
}

export default function SpeciesCard({ animal }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Image section */}
        {animal.imageUrl && (
          <div style={{ flex: "0 0 300px", minWidth: "250px" }}>
            <img
              src={animal.imageUrl}
              alt={animal.commonName}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "var(--radius)",
                border: "1px solid rgba(15,23,36,0.06)",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Content section */}
        <div style={{ flex: "1 1 400px" }}>
          {/* Header with common and scientific names */}
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 24, color: "var(--text)" }}>
              {animal.commonName}
            </h3>
            <p
              style={{
                margin: "4px 0 0 0",
                fontStyle: "italic",
                color: "var(--muted)",
                fontSize: 16,
              }}
            >
              {animal.scientificName}
            </p>
          </div>

          {/* Species status badges */}
          {animal.speciesStatus && animal.speciesStatus.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              {animal.speciesStatus.map((status, idx) => {
                const style = getStatusStyle(status);
                return (
                  <span
                    key={idx}
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: "999px",
                      fontSize: 12,
                      fontWeight: 600,
                      background: style.background,
                      color: style.color,
                    }}
                  >
                    {status}
                  </span>
                );
              })}
            </div>
          )}

          {/* Primary region */}
          {animal.primaryRegion && (
            <div style={{ marginBottom: 12 }}>
              <strong style={{ fontSize: 13, color: "var(--muted)" }}>
                📍 Primary Region:
              </strong>
              <p style={{ margin: "4px 0 0 0", fontSize: 14 }}>
                {animal.primaryRegion}
              </p>
            </div>
          )}

          {/* Description */}
          {animal.description && (
            <div style={{ marginBottom: 12 }}>
              <strong style={{ fontSize: 13, color: "var(--muted)" }}>
                Description:
              </strong>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "var(--text)",
                }}
              >
                {animal.description}
              </p>
            </div>
          )}

          {/* Diet */}
          {animal.diet && (
            <div style={{ marginBottom: 12 }}>
              <strong style={{ fontSize: 13, color: "var(--muted)" }}>
                🍽️ Diet:
              </strong>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {animal.diet}
              </p>
            </div>
          )}

          {/* Native range */}
          {animal.nativeRange && (
            <div style={{ marginBottom: 12 }}>
              <strong style={{ fontSize: 13, color: "var(--muted)" }}>
                🌍 Native Range:
              </strong>
              <p style={{ margin: "4px 0 0 0", fontSize: 14 }}>
                {animal.nativeRange}
              </p>
            </div>
          )}

          {/* Environmental impact */}
          {animal.environmentalImpact && (
            <div style={{ marginBottom: 12 }}>
              <strong style={{ fontSize: 13, color: "var(--muted)" }}>
                ⚠️ Environmental Impact:
              </strong>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {animal.environmentalImpact}
              </p>
            </div>
          )}

          {/* Citation link */}
          {animal.citation && (
            <div style={{ marginTop: 16 }}>
              <a
                href={animal.citation}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 13,
                  color: "var(--accent)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                🔗 Learn more →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
