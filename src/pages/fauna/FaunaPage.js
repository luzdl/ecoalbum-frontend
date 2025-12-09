// ...existing code...

const STATUS_LABEL = {
  lc: 'Preocupación menor',
  nt: 'Casi amenazado',
  vu: 'Vulnerable',
  en: 'En peligro',
  cr: 'Peligro crítico',
};

const STATUS_COLOR = {
  lc: '#27ae60', // Verde
  nt: '#f39c12', // Naranja
  vu: '#e67e22', // Naranja oscuro
  en: '#e74c3c', // Rojo
  cr: '#c0392b', // Rojo oscuro
};

class FaunaPage {
  constructor(container) {
    this.container = container;
    this.species = [];
    this.filtered = [];
    this.categories = []; // Map de categorías: { id, nombre, descripcion }
    this.filters = { query: "", category: "", status: "", letter: "" };
    this.loading = false;
  }

  async init() {
    this.render();
    await this.loadCategories();
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
      statusFilter.addEventListener("change", async (e) => {
        this.filters.status = e.target.value;
        // Si hay un estado seleccionado, recarga desde la API con el query param
        if (this.filters.status) {
          await this.loadSpeciesWithStatus(this.filters.status);
        } else {
          await this.loadSpecies();
        }
      });
    }
  }

  // ...existing code...
  async loadCategories() {
    try {
      const res = await fetch("http://localhost:8000/api/fauna/categorias/", {
        headers: { Accept: "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        this.categories = Array.isArray(data) ? data : (data?.results || []);
        console.log("Categorías cargadas:", this.categories);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      this.categories = [];
    }
  }

  getCategoryName(categoryId) {
    if (!categoryId) return "—";
    // Si ya es un string (nombre), retornarlo
    if (typeof categoryId === 'string' && isNaN(categoryId)) return categoryId;
    // Buscar en el mapa de categorías
    const cat = this.categories.find(c => c.id === parseInt(categoryId) || c.id === categoryId);
    return cat?.nombre || categoryId;
  }

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

  async loadSpeciesWithStatus(statusKey) {
    this.loading = true;
    this.showLoading();
    try {
      const url = `http://localhost:8000/api/fauna/fauna/?estado=${encodeURIComponent(statusKey)}`;
      let allSpecies = [];
      let nextUrl = url;
      while (nextUrl) {
        const res = await fetch(nextUrl, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data.results)) {
          allSpecies = allSpecies.concat(data.results);
        }
        nextUrl = data.next || null;
      }
      this.species = allSpecies;
      this.applyFilters();
    } catch (err) {
      this.species = [];
      this.showError(err.message || "Error al cargar especies");
    } finally {
      this.loading = false;
    }
  }

  populateFilters() {
    const catSelect = document.getElementById("category-filter");
    catSelect.innerHTML = '<option value="">Categoría</option>';
    this.categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat.id;
      opt.textContent = cat.nombre;
      catSelect.appendChild(opt);
    });

    // SOLO usar los estados hardcodeados, nunca extraer de species ni de API
    const statSelect = document.getElementById('status-filter');
    statSelect.innerHTML = `<option value="">Estado</option>`;
    for (const [key, label] of Object.entries(STATUS_LABEL)) {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = label;
      opt.style.color = STATUS_COLOR[key];
      statSelect.appendChild(opt);
    }

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
      // Comparar por ID de categoría (puede ser número o string)
      const matchCategory = !this.filters.category || 
        String(s.categoria) === String(this.filters.category) || 
        s.categoria === parseInt(this.filters.category);
      // Comparar estado por código (lc, nt, vu, en, cr) - el campo estado contiene "(LC)", "(NT)", etc.
      const matchStatus = !this.filters.status || 
        (s.estado && s.estado.toLowerCase().includes(`(${this.filters.status})`));
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
            <span class="gallery-item-category">${this.getCategoryName(s.categoria)}</span>
            ${s.estado ? (() => {
              const code = (s.estado.match(/\(([a-zA-Z]{2})\)/) || [])[1]?.toLowerCase();
              if (code && STATUS_LABEL[code]) {
                return `<span class=\"gallery-item-status\" style=\"background:${STATUS_COLOR[code]}22;color:${STATUS_COLOR[code]}\">${STATUS_LABEL[code]} (${code.toUpperCase()})</span>`;
              }
              return `<span class=\"gallery-item-status\">${s.estado}</span>`;
            })() : ""}
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