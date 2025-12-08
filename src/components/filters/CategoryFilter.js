// ...existing code...
import React from "react";

export default function CategoryFilter({ options = [], value = "", onChange = () => {}, placeholder = "Categoría" }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="Filtrar por categoría" style={{ padding: "6px 8px" }}>
      <option value="">{placeholder}</option>
      {options.map((opt) => {
        // opt puede ser string o objeto {id, name}
        const key = typeof opt === "string" ? opt : opt.id ?? opt.name;
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