import speciesData from "../species";

export default function Species() {
  return (
    <div className="container">
      <div className="card" style={{ padding: 16, marginBottom: 20 }}>
        <h2>Species Database</h2>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>
          Explore detailed information about species and their ecological
          impact.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {speciesData.map((animal, index) => (
          <div key={index} className="card" style={{ padding: 20 }}>
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
                    {animal.speciesStatus.map((status, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "999px",
                          fontSize: 12,
                          fontWeight: 600,
                          background:
                            status.toLowerCase() === "invasive"
                              ? "rgba(239, 71, 111, 0.1)"
                              : "rgba(90, 169, 230, 0.1)",
                          color:
                            status.toLowerCase() === "invasive"
                              ? "#ef476f"
                              : "#5aa9e6",
                        }}
                      >
                        {status}
                      </span>
                    ))}
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
        ))}
      </div>
    </div>
  );
}
