// ...existing code...
import React, { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import CategoryFilter from "./CategoryFilter";
import StatusFilter from "./StatusFilter";
import LetterFilter from "./LetterFilter";

export default function FilterBar({
  onChange = () => {},
  endpoints = {
    categories: "/api/filters/categories",
    statuses: "/api/filters/statuses",
    letters: "/api/filters/letters",
  },
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [letter, setLetter] = useState("");
  const [options, setOptions] = useState({ categories: [], statuses: [], letters: [] });

  useEffect(() => {
    async function load() {
      try {
        const [cRes, sRes, lRes] = await Promise.all([
          fetch(endpoints.categories).then((r) => r.json()).catch(() => []),
          fetch(endpoints.statuses).then((r) => r.json()).catch(() => []),
          fetch(endpoints.letters).then((r) => r.json()).catch(() => []),
        ]);
        setOptions({ categories: cRes || [], statuses: sRes || [], letters: lRes || [] });
      } catch (e) {
        // silent fallback
      }
    }
    load();
  }, [endpoints.categories, endpoints.statuses, endpoints.letters]);

  useEffect(() => {
    onChange({ query, category, status, letter });
  }, [query, category, status, letter, onChange]);

  return (
    <div className="filter-bar" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <SearchInput value={query} onChange={setQuery} placeholder="Buscar..." />
      <CategoryFilter options={options.categories} value={category} onChange={setCategory} />
      <StatusFilter options={options.statuses} value={status} onChange={setStatus} />
      <LetterFilter letters={options.letters.length ? options.letters : undefined} value={letter} onChange={setLetter} />
    </div>
  );
}
// ...existing code...