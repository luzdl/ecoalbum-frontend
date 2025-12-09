import { createLink } from '../../router/router.js';
import { createFlipCard, buildFront, buildBack } from '../../components/cards/FlipCard.js';
import './FaunaPage.css';

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

function excerptText(t, len = 140) {
  if (!t) return '';
  const s = String(t).trim();
  if (s.length <= len) return s;
  return s.slice(0, len).trim() + '…';
}

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
        <header class="fauna-header page-header">
          <nav class="breadcrumb">${createLink('/', 'Inicio')} / ${createLink('/fauna','Fauna')}</nav>
          <div class="header-row">
            <div>
              <h1>Fauna del Álbum Ecológico</h1>
              <p>Explora la biodiversidad de nuestra región</p>
            </div>
            <div class="header-actions"></div>
          </div>
        </header>
        
        <div class="fauna-filters">
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
    const categoryFilter = document.getElementById("category-filter");
    const statusFilter = document.getElementById("status-filter");
    // search input removed per UX request

    if (categoryFilter) {
      categoryFilter.addEventListener("change", (e) => {
        this.filters.category = e.target.value;
        this.applyFilters();
      });
    }

    if (statusFilter) {
      // Use client-side filtering like Flora: set filter and re-apply
      statusFilter.addEventListener("change", (e) => {
        this.filters.status = e.target.value;
        this.applyFilters();
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
      await this.applyFilters();
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
      await this.applyFilters();
    } catch (err) {
      this.species = [];
      this.showError(err.message || "Error al cargar especies");
    } finally {
      this.loading = false;
    }
  }

  // Fetch detalle por especie (fauna)
  async fetchFaunaDetail(id) {
    if (!id) return null;
    try {
      const res = await fetch(`http://localhost:8000/api/fauna/fauna/${id}/`, { headers: { Accept: 'application/json' } });
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('Error fetching fauna detail', id, err);
      return null;
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
    // Crear botón 'Todas' como elemento y agregar listener para resetear el filtro
    letterDiv.innerHTML = '';
    const todasBtn = document.createElement('button');
    todasBtn.className = 'letter-btn active';
    todasBtn.textContent = 'Todas';
    todasBtn.dataset.letter = '';
    todasBtn.addEventListener('click', () => {
      document.querySelectorAll('.letter-btn').forEach((b) => b.classList.remove('active'));
      todasBtn.classList.add('active');
      this.filters.letter = '';
      this.applyFilters();
    });
    letterDiv.appendChild(todasBtn);

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

  async applyFilters() {
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
    await this.renderGallery();
  }

  async renderGallery() {
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
      gallery.innerHTML = '';
      return;
    }

    // Construir FlipCards para cada especie (usa la misma lógica visual que la Home)
    gallery.innerHTML = '';
    const frag = document.createDocumentFragment();

    // Pre-fetch detalles para cada especie en paralelo
    const details = await Promise.all(this.filtered.map(async (s) => {
      const id = s.id || s.pk || s.id_planta || '';
      return await this.fetchFaunaDetail(id);
    }));

    const getEstadoBadgeHTML = (estado) => {
        if (!estado) return `<div class="badge">Sin clasificar</div>`;
        const s = String(estado || '').toUpperCase();
        // Buscar código explícito (LC/NT/VU/EN/CR)
        const codeMatch = s.match(/\b(LC|NT|VU|EN|CR)\b/i);
        let cls = 'badge';
        if (codeMatch) cls = `badge badge-${codeMatch[1].toLowerCase()}`;
        else if (s.includes('CRÍT') || s.includes('CRITIC')) cls = 'badge badge-cr';
        else if (s.includes('EN PELIG') || s.includes('EN PELIGRO')) cls = 'badge badge-en';
        else if (s.includes('VULN') || s.includes('VULNER')) cls = 'badge badge-vu';
        else if (s.includes('AMENAZ') || s.includes('CASI')) cls = 'badge badge-nt';
        else if (s.includes('PREOCUP') || s.includes('LC')) cls = 'badge badge-lc';
        const text = estado || 'Sin clasificar';
        return `<div class="${cls}" data-estado="${String(estado).replace(/\"/g,'')}"><span class="badge-dot"></span>${text}</div>`;
    };

    this.filtered.forEach((s, idx) => {
      const id = s.id || s.pk || s.id_planta || '';
      const img = s.foto_principal || s.url_foto || s.imagen || s.url || '/placeholder-species.png';
      const nombre = s.nombre_comun || s.nombre_cientifico || 'Sin nombre';
      const estado = s.estado || s.estado_conservacion || '';
      const detail = details[idx] || {};

      const front = buildFront({ image: img, title: nombre, subtitle: s.nombre_cientifico || '' });
      const back = buildBack({
        statusBadge: getEstadoBadgeHTML(estado),
        // Mostrar distribución (si existe) y usar habitat desde detalle cuando esté disponible
        paragraphs: [ (detail.distribucion && detail.distribucion.trim()) || (s.descripcion_foto && s.descripcion_foto.trim()) || (s.descripcion && s.descripcion.trim()) || 'Especie de fauna registrada en Panamá.' ],
        habitat: detail.habitat || s.habitat || '',
        region: detail.region || s.region || '',
        actions: [
          { label: 'Ver detalles', href: `#/fauna/${id}`, variant: 'btn-primary' }
        ]
      });

      const card = createFlipCard({ front, back, size: 'md', title: nombre });
      frag.appendChild(card);
    });

    gallery.appendChild(frag);
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
// end of file