// ...existing code...
import React, { useEffect } from "react";
import "./Modal.css";

export default function Modal({ isOpen = false, onClose = () => {}, title = "", children, className = "" }) {
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Modal"}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal-content ${className}`}>
        <header className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" aria-label="Cerrar" onClick={onClose}>
            ✕
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
// ...existing code...