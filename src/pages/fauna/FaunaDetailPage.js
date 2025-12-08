// ============================================================
//  Página de Detalle de Fauna – Arreglada y Optimizada
// ============================================================

class FaunaDetailPage {
  constructor(container) {
    this.container = container;
    this.species = null;
    this.threats = [];
    this.conservationActions = [];
    this.categoryName = "";
  }

  async init(species) {
    this.species = species;
    await Promise.all([
      this.loadThreatsAndActions(),
      this.loadCategoryName()
    ]);
    this.render();
  }

  async loadCategoryName() {
    try {
      const categoryId = this.species?.categoria;
      if (!categoryId) return;
      
      // Si ya es un string (nombre), usarlo directamente
      if (typeof categoryId === 'string' && isNaN(categoryId)) {
        this.categoryName = categoryId;
        return;
      }
      
      const res = await fetch(`http://localhost:8000/api/fauna/categorias/${categoryId}/`);
      if (res.ok) {
        const data = await res.json();
        this.categoryName = data.nombre || categoryId;
      }
    } catch (err) {
      console.error("Error loading category:", err);
      this.categoryName = this.species?.categoria || "";
    }
  }

  async loadThreatsAndActions() {
    try {
      const id = this.species.id;

      // ------------------------
      // Cargar Amenazas
      // ------------------------
      const threatRes = await fetch(`http://localhost:8000/api/fauna/fauna/${id}/amenazas/`);
      if (threatRes.ok) {
        const threatData = await threatRes.json();
        this.threats = Array.isArray(threatData) ? threatData : threatData.results || [];
      }

      // ------------------------
      // Cargar Acciones
      // ------------------------
      const actionRes = await fetch(`http://localhost:8000/api/fauna/fauna/${id}/acciones/`);
      if (actionRes.ok) {
        const actionData = await actionRes.json();
        this.conservationActions = Array.isArray(actionData) ? actionData : actionData.results || [];
      }
    } catch (err) {
      console.error("Error loading threats/actions:", err);
    }
  }

  // ============================================================
  // Render principal
  // ============================================================

  render() {
    const s = this.species || {};

    // ------------------------------
    // Normalizar datos
    // ------------------------------

    const nombre_comun = s.nombre_comun || "Nombre no disponible";
    const nombre_cientifico = s.nombre_cientifico || "";

    // Normalizar categoría
    const categoria =
      typeof s.categoria === "string"
        ? s.categoria
        : s.categoria?.nombre || "—";

    // Normalizar estado
    const estado_conservacion =
      typeof s.estado_conservacion === "string"
        ? s.estado_conservacion
        : s.estado_conservacion?.nombre || "—";

    const descripcion = s.descripcion || "Sin descripción disponible.";

    // ------------------------------
    // Normalizar imágenes (foto_principal + fotos del array)
    // ------------------------------

    let imagenes = [];

    // Intentar foto_principal
    if (typeof s.foto_principal === "string" && s.foto_principal) {
      imagenes.push(s.foto_principal);
    } else if (s.foto_principal?.url_foto) {
      imagenes.push(s.foto_principal.url_foto);
    } else if (s.foto_principal?.url) {
      imagenes.push(s.foto_principal.url);
    }

    // Intentar array de fotos
    if (Array.isArray(s.fotos) && s.fotos.length > 0) {
      s.fotos.forEach((f) => {
        const url = f.url_foto || f.url || f.foto || '';
        if (url && !imagenes.includes(url)) {
          imagenes.push(url);
        }
      });
    }

    // Si no hay imágenes, usar placeholder
    if (imagenes.length === 0) {
      imagenes.push("/placeholder-species.png");
    }

    // Normalizar URLs a absolutas si es necesario
    imagenes = imagenes.map((img) => {
      if (!img) return "/placeholder-species.png";
      if (img.startsWith("/")) return `http://localhost:8000${img}`;
      return img;
    });

    console.log("Imágenes renderizadas:", imagenes);

    // ============================================================
    // Render HTML
    // ============================================================

    this.container.innerHTML = `
      <div class="fauna-detail-page">
        <div class="detail-modal">
          <div class="detail-header">
            <h2>${nombre_comun}</h2>
            <button class="detail-close btn btn-primary" aria-label="Volver">← Volver</button>
          </div>

          <div class="detail-content">
            <div class="species-grid">
              
              <!-- Galería de imágenes -->
              <div class="species-images">
                ${imagenes.map((img) => `
                  <img
                    class="species-image"
                    src="${img}"
                    alt="${nombre_comun}"
                    onerror="this.onerror=null; this.src='/placeholder-species.png'"
                  />
                `).join('')}
              </div>

              <div class="species-meta">

                ${nombre_cientifico ? `<div class="species-row" style="font-style: italic; color: #666;">${nombre_cientifico}</div>` : ""}

                <div class="species-row">
                  <strong>Categoría:</strong> ${categoria}
                </div>

                <div class="species-row">
                  <strong>Estado:</strong> ${estado_conservacion}
                </div>

                <div class="species-description">${descripcion}</div>

                <!-- AMENAZAS -->
                ${
                  this.threats.length > 0
                    ? `
                  <div class="species-section">
                    <h3>Amenazas</h3>
                    <ul class="threats-list">
                      ${this.threats
                        .map(
                          (t) => `
                        <li>
                          <strong>${t.nombre}</strong>
                          <p>${t.descripcion || ""}</p>
                        </li>`
                        )
                        .join("")}
                    </ul>
                  </div>`
                    : ""
                }

                <!-- ACCIONES DE CONSERVACIÓN -->
                ${
                  this.conservationActions.length > 0
                    ? `
                  <div class="species-section">
                    <h3>Acciones de Conservación</h3>
                    <ol class="actions-list" style="list-style-type: decimal; padding-left: 20px;">
                      ${this.conservationActions
                        .map(
                          (a) => `
                        <li>${a.descripcion || a.nombre || "Acción"}</li>`
                        )
                        .join("")}
                    </ol>
                  </div>`
                    : ""
                }

              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // botón volver
    const closeBtn = document.querySelector(".detail-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        window.location.hash = "/fauna";
      });
    }
  }
}

// ============================================================
// Export principal
// ============================================================

export default async function render(container, params = {}) {
  const { id } = params;

  try {
    const url = `http://localhost:8000/api/fauna/fauna/${id}/`;
    const res = await fetch(url);
    const text = await res.text();

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);

    const species = JSON.parse(text);

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
