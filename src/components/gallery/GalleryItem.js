// ...existing code...
import React from "react";

export default function GalleryItem({ item = {}, onClick = () => {} }) {
  const { id, commonName, image, category, status } = item;

  return (
    <div className="gallery-item" onClick={() => onClick(item)} role="button" tabIndex={0} aria-label={`${commonName || "Especie"}`}>
      <div className="gallery-item-image">
        <img src={image || "/placeholder-species.png"} alt={commonName || "Especie"} />
        <div className="gallery-item-overlay">
          <button className="gallery-item-btn" aria-label={`Ver detalles de ${commonName}`}>
            Ver detalles
          </button>
        </div>
      </div>
      <div className="gallery-item-info">
        <h3 className="gallery-item-name">{commonName || "Sin nombre"}</h3>
        <p className="gallery-item-meta">
          <span className="gallery-item-category">{category || "—"}</span>
          {status && <span className="gallery-item-status">{status}</span>}
        </p>
      </div>
    </div>
  );
}
// ...existing code...