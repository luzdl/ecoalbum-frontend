// ...existing code...

class FaunaDetailPage {
  constructor(container) {
    this.container = container;
    this.species = null;
  }

  async init(species) {
    this.species = species;
    this.render();
  }

  render() {
    const {
      nombre_comun = "Nombre común no disponible",
      nombre_cientifico = "",
      foto_principal = "",
      categoria = "",
      estado_conservacion = "",
      descripcion = "",
    } = this.species || {};

    this.container.innerHTML = `
      <div class="fauna-detail-page">
        <div class="detail-modal">
          <div class="detail-header">
            <h2>${nombre_comun}</h2>
            <button class="detail-close" aria-label="Volver">← Volver</button>
          </div>
          <div class="detail-content">
            <div class="species-grid">
              <img class="species-image" src="${foto_principal || "/placeholder-species.png"}" alt="${nombre_comun}" />
              <div class="species-meta">
                ${nombre_cientifico ? `<div class="species-row" style="font-style: italic; color: #666;">${nombre_cientifico}</div>` : ""}
                <div class="species-row"><strong>Categoría:</strong>&nbsp;${categoria || "—"}</div>
                <div class="species-row"><strong>Estado:</strong>&nbsp;${estado_conservacion || "—"}</div>
                <div class="species-description">${descripcion || "No hay descripción disponible."}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const closeBtn = document.querySelector(".detail-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        window.location.hash = "/fauna";
      });
    }
  }
}

// Exportar como default la función render
export default async function render(container, params = {}) {
  const { id } = params;
  
  try {
    const res = await fetch(`http://localhost:8000/fauna/fauna/${id}/`);
    if (!res.ok) throw new Error("Especie no encontrada");
    const species = await res.json();
    
    const page = new FaunaDetailPage(container);
    await page.init(species);
  } catch (err) {
    container.innerHTML = `
      <div class="error">
        <h1>Error</h1>
        <p>${err.message}</p>
        <a href="#/fauna">Volver a Fauna</a>
      </div>
    `;
  }
}
// ...existing code...