// ...existing code...
class FaunaDetailPage {
  constructor(containerId = "app") {
    this.container = document.getElementById(containerId);
    this.species = null;
  }

  init(species) {
    this.species = species;
    this.render();
  }

  render() {
    const {
      commonName = "Nombre común no disponible",
      scientificName = "",
      image = "",
      category = "",
      status = "",
      description = "",
      sourceUrl = "",
    } = this.species || {};

    this.container.innerHTML = `
      <div class="fauna-detail-page">
        <div class="detail-modal">
          <div class="detail-header">
            <h2>${commonName}</h2>
            <button class="detail-close" aria-label="Volver">← Volver</button>
          </div>
          <div class="detail-content">
            <div class="species-grid">
              <img class="species-image" src="${image || "/placeholder-species.png"}" alt="${commonName}" />
              <div class="species-meta">
                ${scientificName ? `<div class="species-row" style="font-style: italic; color: #666;">${scientificName}</div>` : ""}
                <div class="species-row"><strong>Categoría:</strong>&nbsp;${category || "—"}</div>
                <div class="species-row"><strong>Estado:</strong>&nbsp;${status || "—"}</div>
                ${sourceUrl ? `<div class="species-row"><a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">Ver fuente</a></div>` : ""}
                <div class="species-description">${description || "No hay descripción disponible."}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.querySelector(".detail-close").addEventListener("click", () => {
      const page = new FaunaPage("app");
      page.init();
    });
  }
}

// Exportar para usar en HTML
window.FaunaDetailPage = FaunaDetailPage;
// ...existing code...