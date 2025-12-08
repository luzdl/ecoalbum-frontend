/**
 * @fileoverview Página de flora (galería de plantas)
 * @module pages/flora/FloraPage
 */

import { createLink } from '../../router/router.js';
import { getPlantas, ESTADOS_CONSERVACION } from '../../services/floraService.js';
import { createFilterBar } from '../../components/filters/FilterBar.js';
import { loadGallery } from '../../components/gallery/Gallery.js';

/**
 * FloraPage - integra FilterBar + Gallery + PlantCard (FlipCard)
 * Usa `getPlantas` como fetchFn para `loadGallery`
 */
class FloraPage {
  constructor(container) {
    this.container = container;
    this.plantas = [];
    this.filtered = [];
    this.filters = { query: '', familia: '', estado: '', letter: '' };
    this.loading = false;
  }

  async init() {
    this.render();
    await this.loadPlantas();
  }

  render() {
    this.container.innerHTML = `
      <div class="flora-page">
        <header class="flora-header">
          <nav class="breadcrumb">${createLink('/', 'Inicio')} / ${createLink('/flora','Flora')}</nav>
          <h1>🌺 Flora del Álbum Ecológico</h1>
          <p>Explora las plantas y su conservación</p>
        </header>

        <div class="flora-filters">
          <input type="search" id="search-input" class="filter-input" placeholder="Buscar planta..." aria-label="Buscar" />
          <select id="familia-filter" class="filter-select" aria-label="Filtrar por familia">
            <option value="">Familia</option>
          </select>
          <select id="estado-filter" class="filter-select" aria-label="Filtrar por estado">
            <option value="">Estado</option>
          </select>
          <div id="letter-filter" class="letter-filter"></div>
        </div>

        <div id="gallery" class="gallery-grid"></div>
        <div id="loading" class="flora-loading" style="display:none;">Cargando...</div>
        <div id="error" class="flora-error" style="display:none;"></div>
        <div id="empty" class="flora-empty" style="display:none;">No se encontraron plantas.</div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const searchInput = document.getElementById('search-input');
    const familiaSelect = document.getElementById('familia-filter');
    const estadoSelect = document.getElementById('estado-filter');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.query = e.target.value || '';
        this.applyFilters();
      });
    }

    if (familiaSelect) {
      familiaSelect.addEventListener('change', (e) => {
        this.filters.familia = e.target.value;
        this.applyFilters();
      });
    }

    if (estadoSelect) {
      estadoSelect.addEventListener('change', (e) => {
        this.filters.estado = e.target.value;
        this.applyFilters();
      });
    }
  }

  async loadPlantas() {
    this.loading = true;
    this.showLoading();

    try {
      const res = await getPlantas();
      // Normalizar respuesta a array
      if (!res) this.plantas = [];
      else if (Array.isArray(res)) this.plantas = res;
      else if (res.results && Array.isArray(res.results)) this.plantas = res.results;
      else if (res.items && Array.isArray(res.items)) this.plantas = res.items;
      else if (typeof res === 'object') this.plantas = Object.values(res);
      else this.plantas = [];

      this.populateFilters();
      this.applyFilters();
    } catch (err) {
      console.error('Error cargando plantas:', err);
      this.plantas = [];
      this.showError(err.message || 'Error al cargar plantas');
    } finally {
      this.loading = false;
    }
  }

  populateFilters() {
    const familias = [...new Set(this.plantas.map((p) => p.familia).filter(Boolean))];
    const estados = [...new Set(this.plantas.map((p) => p.estado || p.estado_conservacion).filter(Boolean))];

    const famSelect = document.getElementById('familia-filter');
    famSelect.innerHTML = `<option value="">Familia</option>`;
    familias.forEach((f) => {
      const opt = document.createElement('option');
      opt.value = f;
      opt.textContent = f;
      famSelect.appendChild(opt);
    });

    const estSelect = document.getElementById('estado-filter');
    estSelect.innerHTML = `<option value="">Estado</option>`;
    // preferir la lista proporcionada por el servicio si existe
    if (Array.isArray(ESTADOS_CONSERVACION) && ESTADOS_CONSERVACION.length) {
      ESTADOS_CONSERVACION.forEach((s) => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        estSelect.appendChild(opt);
      });
    } else {
      estados.forEach((s) => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        estSelect.appendChild(opt);
      });
    }

    const letterDiv = document.getElementById('letter-filter');
    letterDiv.innerHTML = `<button class="letter-btn active" data-letter="">Todas</button>`;
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      const btn = document.createElement('button');
      btn.className = 'letter-btn';
      btn.textContent = letter;
      btn.dataset.letter = letter;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.letter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.filters.letter = letter;
        this.applyFilters();
      });
      letterDiv.appendChild(btn);
    }
  }

  applyFilters() {
    this.filtered = this.plantas.filter((p) => {
      const name = p.nombre_comun || p.nombre_cientifico || '';
      const matchQuery = !this.filters.query || name.toLowerCase().includes(this.filters.query.toLowerCase());
      const matchFamilia = !this.filters.familia || p.familia === this.filters.familia;
      const estadoField = p.estado || p.estado_conservacion || '';
      const matchEstado = !this.filters.estado || estadoField === this.filters.estado;
      const matchLetter = !this.filters.letter || name.toUpperCase().startsWith(this.filters.letter);
      return matchQuery && matchFamilia && matchEstado && matchLetter;
    });

    this.renderGallery();
  }

  renderGallery() {
    const gallery = document.getElementById('gallery');
    const empty = document.getElementById('empty');
    const error = document.getElementById('error');

    if (!gallery) return;

    error.style.display = 'none';
    empty.style.display = 'none';
    gallery.style.display = 'grid';

    if (this.filtered.length === 0) {
      gallery.style.display = 'none';
      empty.style.display = 'block';
      gallery.innerHTML = '';
      return;
    }

    gallery.innerHTML = this.filtered
      .map((p) => {
        const id = p.id_planta || p.id || p.pk || '';
        const img = p.foto_principal || p.url_foto || p.imagen || p.url || '/placeholder-species.png';
        const nombre = p.nombre_comun || p.nombre_cientifico || 'Sin nombre';
        const familia = p.familia || '—';
        const estado = p.estado || p.estado_conservacion || '';

        return `
        <div class="gallery-item" data-id="${id}">
          <div class="gallery-item-image">
            <img src="${img}" alt="${nombre}" onerror="this.src='/placeholder-species.png'" />
            <div class="gallery-item-overlay">
              <button class="gallery-item-btn">Ver detalles</button>
            </div>
          </div>
          <div class="gallery-item-info">
            <h3 class="gallery-item-name">${nombre}</h3>
            <p class="gallery-item-meta">
              <span class="gallery-item-family">${familia}</span>
              ${estado ? `<span class="gallery-item-status">${estado}</span>` : ''}
            </p>
          </div>
        </div>
      `;
      })
      .join('');

    gallery.querySelectorAll('.gallery-item').forEach((item) => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        if (!id) return;
        window.location.hash = `/flora/${id}`;
      });
    });
  }

  showLoading() {
    const loading = document.getElementById('loading');
    const gallery = document.getElementById('gallery');
    if (loading) loading.style.display = 'block';
    if (gallery) gallery.style.display = 'none';
  }

  showError(msg) {
    const error = document.getElementById('error');
    const gallery = document.getElementById('gallery');
    if (error) {
      error.textContent = msg;
      error.style.display = 'block';
    }
    if (gallery) gallery.style.display = 'none';
  }
}

export default async function render(container, params = {}) {
  const page = new FloraPage(container);
  await page.init();
}

