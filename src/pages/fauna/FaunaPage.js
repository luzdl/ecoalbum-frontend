// ...existing code...

class FaunaPage {
  constructor(container) {
    this.container = container;
    this.species = [];
    this.filtered = [];
    this.filters = { query: "", category: "", status: "", letter: "" };
    this.loading = false;
  }

  async init() {
    this.render();
    await this.loadSpecies();
  }

  render() {
    this.container.innerHTML = `
      <div class="fauna-page">
        <header class="fauna-header">
          <h1>Fauna del Álbum Ecológico</h1>
          <p>Explora la biodiversidad de nuestra región</p>
        </header>
        
        <div class="fauna-filters">
          <input 
            type="search" 
            id="search-input" 
            class="filter-input" 
            placeholder="Buscar especie..."
            aria-label="Buscar"
          />
          <select id="category-filter" class="filter-select" aria-label="Filtrar por categoría">
            <option value="">Categoría</option>
          </select>
          <select id="status-filter" class="filter-select" aria-label="Filtrar por estado">
            <option value="">Estado</option>
          </select>
          <div id="letter-filter" class="letter-filter"></div>
        </div>

        <div id="gallery" class="gallery-grid"></div>
        <div id="loading" class="fauna-loading" style="display:none;">Cargando...</div>
        <div id="error" class="fauna-error" style="display:none;"></div>
        <div id="empty" class="fauna-empty" style="display:none;">No se encontraron especies.</div>
      </div>
    `;
    this.attachEvents();
  }

  attachEvents() {
    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");
    const statusFilter = document.getElementById("status-filter");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filters.query = e.target.value;
        this.applyFilters();
      });
    }

    if (categoryFilter) {
      categoryFilter.addEventListener("change", (e) => {
        this.filters.category = e.target.value;
        this.applyFilters();
      });
    }

    if (statusFilter) {
      statusFilter.addEventListener("change", (e) => {
        this.filters.status = e.target.value;
        this.applyFilters();
      });
    }
  }

  // ...existing code...
  async loadSpecies() {
    this.loading = true;
    this.showLoading();
    try {
      const url = "http://localhost:8000/api/fauna/fauna/";
      console.log("Fetching species from:", url);
      
      let allSpecies = [];
      let nextUrl = url;
      
      // Cargar todas las páginas
      while (nextUrl) {
        const res = await fetch(nextUrl, { headers: { Accept: "application/json" } });
        console.log("Fetch status:", res.status, "from", nextUrl);
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        
        // Agregar resultados de esta página
        if (Array.isArray(data.results)) {
          allSpecies = allSpecies.concat(data.results);
        }
        
        // Ir a la siguiente página si existe
        nextUrl = data.next || null;
        console.log("Loaded page, total so far:", allSpecies.length, "Next:", nextUrl);
      }
      
      this.species = allSpecies;
      console.log("Total species loaded:", this.species.length);
      this.populateFilters();
      this.applyFilters();
    } catch (err) {
      console.error("Error:", err);
      this.species = [];
      this.showError(err.message || "Error al cargar especies");
    } finally {
      this.loading = false;
    }
  }
// ...existing code...

  populateFilters() {
    const categories = [...new Set(this.species.map((s) => s.categoria).filter(Boolean))];
    const statuses = [...new Set(this.species.map((s) => s.estado_conservacion).filter(Boolean))];

    const catSelect = document.getElementById("category-filter");
    categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      catSelect.appendChild(opt);
    });

    const statSelect = document.getElementById("status-filter");
    statuses.forEach((st) => {
      const opt = document.createElement("option");
      opt.value = st;
      opt.textContent = st;
      statSelect.appendChild(opt);
    });

    const letterDiv = document.getElementById("letter-filter");
    letterDiv.innerHTML = `<button class="letter-btn active" data-letter="">Todas</button>`;
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      const btn = document.createElement("button");
      btn.className = "letter-btn";
      btn.textContent = letter;
      btn.dataset.letter = letter;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".letter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.filters.letter = letter;
        this.applyFilters();
      });
      letterDiv.appendChild(btn);
    }
  }

  applyFilters() {
    this.filtered = this.species.filter((s) => {
      const matchQuery = !this.filters.query || s.nombre_comun?.toLowerCase().includes(this.filters.query.toLowerCase());
      const matchCategory = !this.filters.category || s.categoria === this.filters.category;
      const matchStatus = !this.filters.status || s.estado_conservacion === this.filters.status;
      const matchLetter = !this.filters.letter || s.nombre_comun?.toUpperCase().startsWith(this.filters.letter);
      return matchQuery && matchCategory && matchStatus && matchLetter;
    });
    this.renderGallery();
  }

  renderGallery() {
    const gallery = document.getElementById("gallery");
    const empty = document.getElementById("empty");
    const error = document.getElementById("error");

    if (!gallery) return;

    error.style.display = "none";
    empty.style.display = "none";
    gallery.style.display = "grid";

    if (this.filtered.length === 0) {
      gallery.style.display = "none";
      empty.style.display = "block";
      return;
    }

    gallery.innerHTML = this.filtered
      .map(
        (s) => `
      <div class="gallery-item" data-id="${s.id}">
        <div class="gallery-item-image">
          <img src="${s.foto_principal || "/placeholder-species.png"}" alt="${s.nombre_comun}" />
          <div class="gallery-item-overlay">
            <button class="gallery-item-btn">Ver detalles</button>
          </div>
        </div>
        <div class="gallery-item-info">
          <h3 class="gallery-item-name">${s.nombre_comun || "Sin nombre"}</h3>
          <p class="gallery-item-meta">
            <span class="gallery-item-category">${s.categoria || "—"}</span>
            ${s.estado_conservacion ? `<span class="gallery-item-status">${s.estado_conservacion}</span>` : ""}
          </p>
        </div>
      </div>
    `
      )
      .join("");

    gallery.querySelectorAll(".gallery-item").forEach((item) => {
      item.addEventListener("click", () => {
        const id = item.dataset.id;
        window.location.hash = `/fauna/${id}`;
      });
    });
  }

  showLoading() {
    const loading = document.getElementById("loading");
    const gallery = document.getElementById("gallery");
    if (loading) loading.style.display = "block";
    if (gallery) gallery.style.display = "none";
  }

  showError(msg) {
    const error = document.getElementById("error");
    const gallery = document.getElementById("gallery");
    if (error) {
      error.textContent = msg;
      error.style.display = "block";
    }
    if (gallery) gallery.style.display = "none";
  }
}

// Exportar como default la función render
export default async function render(container, params = {}) {
  const page = new FaunaPage(container);
  await page.init();
}
// ...existing code...