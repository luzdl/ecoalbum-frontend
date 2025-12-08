// ...existing code...

class FaunaDetailPage {
  constructor(container) {
    this.container = container;
    this.species = null;
    this.threats = [];
    this.conservationActions = [];
  }

  async init(species) {
    this.species = species;
    await this.loadThreatsAndActions();
    this.render();
  }

  async loadThreatsAndActions() {
    try {
      const id = this.species.id;
      
      // Cargar amenazas
      const threatRes = await fetch(`http://localhost:8000/api/fauna/fauna/${id}/amenazas/`);
      if (threatRes.ok) {
        const threatData = await threatRes.json();
        this.threats = Array.isArray(threatData) ? threatData : (threatData?.results || []);
      }

      // Cargar acciones de conservación
      const actionRes = await fetch(`http://localhost:8000/api/fauna/fauna/${id}/acciones/`);
      if (actionRes.ok) {
        const actionData = await actionRes.json();
        this.conservationActions = Array.isArray(actionData) ? actionData : (actionData?.results || []);
      }
    } catch (err) {
      console.error("Error loading threats/actions:", err);
    }
  }

  // ...existing code...
  render() {
    const {
      nombre_comun = "Nombre común no disponible",
      nombre_cientifico = "",
      foto_principal = "",
      categoria = "",
      estado_conservacion = "",
      descripcion = "",
    } = this.species || {};

    console.log("Species data:", this.species);
    console.log("Image URL:", foto_principal);

    // Construir URL completa si es relativa
    let imageUrl = foto_principal;
    if (foto_principal && !foto_principal.startsWith("http")) {
      imageUrl = `http://localhost:8000${foto_principal}`;
    }
    imageUrl = imageUrl || "/placeholder-species.png";
    console.log("Final image URL:", imageUrl);

    this.container.innerHTML = `
      <div class="fauna-detail-page">
        <div class="detail-modal">
          <div class="detail-header">
            <h2>${nombre_comun}</h2>
            <button class="detail-close" aria-label="Volver">← Volver</button>
          </div>
          <div class="detail-content">
            <div class="species-grid">
              <img class="species-image" src="${imageUrl}" alt="${nombre_comun}" onerror="console.log('Image failed to load:', this.src)" />
              <div class="species-meta">
                ${nombre_cientifico ? `<div class="species-row" style="font-style: italic; color: #666;">${nombre_cientifico}</div>` : ""}
                <div class="species-row"><strong>Categoría:</strong>&nbsp;${categoria || "—"}</div>
                <div class="species-row"><strong>Estado:</strong>&nbsp;${estado_conservacion || "—"}</div>
                <div class="species-description">${descripcion || "No hay descripción disponible."}</div>
                
                <!-- AMENAZAS -->
                ${this.threats.length > 0 ? `
                  <div class="species-section">
                    <h3>Amenazas</h3>
                    <ul class="threats-list">
                      ${this.threats.map(threat => `
                        <li>
                          <strong>${threat.nombre || threat.name || "Amenaza"}</strong>
                          ${threat.descripcion || threat.description ? `<p>${threat.descripcion || threat.description}</p>` : ""}
                        </li>
                      `).join("")}
                    </ul>
                  </div>
                ` : ""}

                <!-- ACCIONES DE CONSERVACIÓN -->
                ${this.conservationActions.length > 0 ? `
                  <div class="species-section">
                    <h3>Acciones de Conservación</h3>
                    <ol class="actions-list" style="list-style-type: decimal; padding-left: 20px;">
                      ${this.conservationActions.map((action) => `
                        <li style="margin-bottom: 10px;">
                          ${action.descripcion || action.description || action.nombre || action.name || "Acción"}
                        </li>
                      `).join("")}
                    </ol>
                  </div>
                ` : ""}
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

export default async function render(container, params = {}) {
  const { id } = params;
  console.log("Intentando cargar especie con ID:", id);
  
  try {
    const url = `http://localhost:8000/api/fauna/fauna/${id}/`;
    console.log("Fetch URL:", url);
    const res = await fetch(url);
    const text = await res.text();
    console.log("Response status:", res.status);
    console.log("Response body:", text.slice(0, 500));
    
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0,100)}`);
    const species = JSON.parse(text);
    
    const page = new FaunaDetailPage(container);
    await page.init(species);
  } catch (err) {
    console.error("Error completo:", err);
    container.innerHTML = `
      <div class="error">
        <h1>Error</h1>
        <p>${err.message}</p>
        <pre>${err.stack}</pre>
        <a href="#/fauna">Volver a Fauna</a>
      </div>
    `;
  }
}
// ...existing code...