// ...existing code...
import React from "react";

export default function StatusFilter({ options = ["active", "inactive"], value = "", onChange = () => {}, placeholder = "Estado" }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="Filtrar por estado" style={{ padding: "6px 8px" }}>
      <option value="">{placeholder}</option>
      {options.map((opt) => {
        const key = typeof opt === "string" ? opt : opt.id ?? opt.value;
        const label = typeof opt === "string" ? opt : opt.name ?? opt.label ?? key;
        return (
          <option key={key} value={key}>
            {label}
          </option>
        );
      })}
    </select>
  );
}
// ...existing code...