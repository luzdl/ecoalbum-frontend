// ...existing code...
import React from "react";
import Modal from "./Modal";

export default function SpeciesDetailModal({ isOpen = false, onClose = () => {}, species = {} }) {
  const {
    commonName = "Nombre común no disponible",
    scientificName = "",
    image = "",
    category = "",
    status = "",
    description = "",
    sourceUrl = "",
  } = species || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={commonName || scientificName}>
      <div className="species-grid">
        <img className="species-image" src={image || "/placeholder-species.png"} alt={commonName || scientificName} />
        <div className="species-meta">
          {scientificName ? (
            <div className="species-row" style={{ fontStyle: "italic", color: "#666" }}>
              {scientificName}
            </div>
          ) : null}
          <div className="species-row"><strong>Categoría:</strong>&nbsp;{category || "—"}</div>
          <div className="species-row"><strong>Estado:</strong>&nbsp;{status || "—"}</div>
          {sourceUrl ? (
            <div className="species-row">
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer">Ver fuente</a>
            </div>
          ) : null}
          <div className="species-description">{description || "No hay descripción disponible."}</div>
        </div>
      </div>
    </Modal>
  );
}
// ...existing code...