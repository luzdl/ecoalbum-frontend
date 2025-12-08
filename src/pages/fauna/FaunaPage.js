// ...existing code...
class FaunaPage {
  constructor(containerId = "app") {
    this.container = document.getElementById(containerId);
    this.species = [];
    this.filtered = [];
    this.filters = { query: "", category: "", status: "", letter: "" };
    this.selectedSpecies = null;
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
    document.getElementById("search-input").addEventListener("input", (e) => {
      this.filters.query = e.target.value;
      this.applyFilters();
    });

    document.getElementById("category-filter").addEventListener("change", (e) => {
      this.filters.category = e.target.value;
      this.applyFilters();
    });

    document.getElementById("status-filter").addEventListener("change", (e) => {
      this.filters.status = e.target.value;
      this.applyFilters();
    });
  }

  async loadSpecies() {
    this.loading = true;
    this.showLoading();
    try {
      const res = await fetch("/api/species");
      if (!res.ok) throw new Error("Error al cargar especies");
      this.species = await res.json();
      this.populateFilters();
      this.applyFilters();
    } catch (err) {
      this.showError(err.message);
    } finally {
      this.loading = false;
    }
  }

  populateFilters() {
    const categories = [...new Set(this.species.map((s) => s.category).filter(Boolean))];
    const statuses = [...new Set(this.species.map((s) => s.status).filter(Boolean))];

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
      const matchQuery = !this.filters.query || s.commonName?.toLowerCase().includes(this.filters.query.toLowerCase());
      const matchCategory = !this.filters.category || s.category === this.filters.category;
      const matchStatus = !this.filters.status || s.status === this.filters.status;
      const matchLetter = !this.filters.letter || s.commonName?.toUpperCase().startsWith(this.filters.letter);
      return matchQuery && matchCategory && matchStatus && matchLetter;
    });
    this.renderGallery();
  }

  renderGallery() {
    const gallery = document.getElementById("gallery");
    const empty = document.getElementById("empty");
    const error = document.getElementById("error");

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
          <img src="${s.image || "/placeholder-species.png"}" alt="${s.commonName}" />
          <div class="gallery-item-overlay">
            <button class="gallery-item-btn">Ver detalles</button>
          </div>
        </div>
        <div class="gallery-item-info">
          <h3 class="gallery-item-name">${s.commonName || "Sin nombre"}</h3>
          <p class="gallery-item-meta">
            <span class="gallery-item-category">${s.category || "—"}</span>
            ${s.status ? `<span class="gallery-item-status">${s.status}</span>` : ""}
          </p>
        </div>
      </div>
    `
      )
      .join("");

    gallery.querySelectorAll(".gallery-item").forEach((item) => {
      item.addEventListener("click", () => {
        const id = item.dataset.id;
        const species = this.species.find((s) => s.id == id);
        if (species) {
          const detailPage = new FaunaDetailPage("app");
          detailPage.init(species);
        }
      });
    });
  }

  showLoading() {
    document.getElementById("loading").style.display = "block";
    document.getElementById("gallery").style.display = "none";
  }

  showError(msg) {
    const error = document.getElementById("error");
    error.textContent = msg;
    error.style.display = "block";
    document.getElementById("gallery").style.display = "none";
  }
}

// Exportar para usar en HTML
window.FaunaPage = FaunaPage;
// ...existing code...