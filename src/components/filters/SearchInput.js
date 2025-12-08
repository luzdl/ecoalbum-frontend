// ...existing code...
import React, { useEffect, useState } from "react";

export default function SearchInput({ value = "", onChange = () => {}, placeholder = "Buscar...", debounceMs = 300 }) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    const t = setTimeout(() => onChange(local), debounceMs);
    return () => clearTimeout(t);
  }, [local, onChange, debounceMs]);

  return (
    <input
      type="search"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      placeholder={placeholder}
      aria-label="Buscar"
      style={{ padding: "6px 8px", minWidth: 160 }}
    />
  );
}
// ...existing code...