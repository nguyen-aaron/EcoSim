import React, { useState, useMemo } from "react";
import speciesData from "../species";
import SpeciesCard from "../species/SpeciesCard.jsx";

export default function Species() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const allStatuses = useMemo(() => {
    const set = new Set();
    speciesData.forEach((animal) => {
      (animal.speciesStatus || []).forEach((status) => set.add(status));
    });
    return Array.from(set);
  }, []);

  const filteredSpecies = useMemo(() => {
    const query = search.trim().toLowerCase();

    return speciesData.filter((animal) => {
      if (
        statusFilter !== "All" &&
        !(animal.speciesStatus || []).includes(statusFilter)
      ) {
        return false;
      }

      if (!query) return true;

      const haystack = [
        animal.commonName,
        animal.scientificName,
        animal.primaryRegion,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [search, statusFilter]);

  return (
    <div className="container">
      {/* Header card */}
      <div className="card" style={{ padding: 16, marginBottom: 20 }}>
        <h2>Species Database</h2>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>
          Explore detailed information about influential species and their ecological impact.
        </p>

        {/* Controls: search + filter */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <input
            type="text"
            placeholder="Search by name or region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: "1 1 220px",
              padding: "8px 10px",
              borderRadius: "var(--radius)",
              border: "1px solid rgba(148, 163, 184, 0.6)",
              fontSize: 14,
            }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              flex: "0 0 180px",
              padding: "8px 10px",
              borderRadius: "var(--radius)",
              border: "1px solid rgba(148, 163, 184, 0.6)",
              fontSize: 14,
              background: "white",
            }}
          >
            <option value="All">All statuses</option>
            {allStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Result count */}
        <p
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "var(--muted)",
          }}
        >
          Showing {filteredSpecies.length}{" "}
          {filteredSpecies.length === 1 ? "species" : "species"}
        </p>
      </div>

      {/* Cards list */}
      {filteredSpecies.length === 0 ? (
        <div className="card" style={{ padding: 20 }}>
          <p style={{ margin: 0, fontSize: 14 }}>
            No species match your search and filters.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {filteredSpecies.map((animal) => (
            <SpeciesCard
              key={animal.scientificName || animal.commonName}
              animal={animal}
            />
          ))}
        </div>
      )}
    </div>
  );
}
