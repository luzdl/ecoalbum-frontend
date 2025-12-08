// ...existing code...
import React, { useState, useEffect } from "react";
import GalleryItem from "./GalleryItem";
import "./Gallery.css";

export default function Gallery({ items = [], onItemClick = () => {}, loading = false, error = null }) {
  const [displayed, setDisplayed] = useState(items);

  useEffect(() => {
    setDisplayed(items);
  }, [items]);

  if (error) {
    return <div className="gallery-error" role="alert">{error}</div>;
  }

  if (loading) {
    return <div className="gallery-loading">Cargando...</div>;
  }

  if (!displayed || displayed.length === 0) {
    return <div className="gallery-empty">No se encontraron especies.</div>;
  }

  return (
    <div className="gallery-container">
      <div className="gallery-grid">
        {displayed.map((item) => (
          <GalleryItem key={item.id} item={item} onClick={onItemClick} />
        ))}
      </div>
    </div>
  );
}
// ...existing code...