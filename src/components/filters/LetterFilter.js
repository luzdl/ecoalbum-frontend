// ...existing code...
import React from "react";

const DEFAULT_LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

export default function LetterFilter({ letters = DEFAULT_LETTERS, value = "", onChange = () => {} }) {
  return (
    <div role="tablist" aria-label="Filtrar por letra" style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
      <button
        type="button"
        onClick={() => onChange("")}
        style={{ padding: "4px 6px", opacity: value === "" ? 1 : 0.7 }}
        aria-pressed={value === ""}
      >
        Todas
      </button>
      {letters.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          aria-pressed={value === l}
          style={{ padding: "4px 6px", background: value === l ? "#ddd" : "transparent" }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
// ...existing code...