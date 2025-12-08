/**
 * @fileoverview Página de flora (galería de plantas)
 * @module pages/flora/FloraPage
 */

import { createLink } from '../../router/router.js';
import { getPlantas, ESTADOS_CONSERVACION } from '../../services/floraService.js';

class FloraPage {
  constructor(container) {
    this.container = container;
    this.plantas = [];
    this.filtered = [];
    this.filters = { query: '', status: '', letter: '' };
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
          <h1>🌺 Flora de Panamá</h1>
          <p>Explora las plantas protegidas de nuestro país</p>
        </header>

        <div class="flora-filters">
          <input type="search" id="flora-search" class="filter-input" placeholder="Buscar planta..." aria-label="Buscar" />
          <select id="flora-status" class="filter-select" aria-label="Filtrar por estado">
            <option value="">Estado</option>
          </select>
          <div id="flora-letter" class="letter-filter"></div>
        </div>

        <div id="flora-gallery" class="gallery-grid"></div>
        <div id="flora-loading" class="flora-loading" style="display:none;">Cargando...</div>
        <div id="flora-error" class="flora-error" style="display:none;"></div>
        <div id="flora-empty" class="flora-empty" style="display:none;">No hay plantas disponibles.</div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const search = this.container.querySelector('#flora-search');
    const status = this.container.querySelector('#flora-status');

    if (search) {
      search.addEventListener('input', (e) => {
        this.filters.query = e.target.value;
        this.applyFilters();
      });
    }

    if (status) {
      status.addEventListener('change', (e) => {
        this.filters.status = e.target.value;
        this.applyFilters();
      });
    }
  }

  async loadPlantas() {
    this.showLoading();
    try {
      const res = await getPlantas();
      const items = Array.isArray(res) ? res : (res && res.results) ? res.results : (res && res.items) ? res.items : [];
      this.plantas = items;
        this.populateFilters();
      this.applyFilters();
    } catch (err) {
      console.error('Error cargando plantas:', err);
      this.showError(err.message || 'Error al cargar las plantas');
      // leave plantas empty; user sees error and can retry later
    } finally {
      this.hideLoading();
    }
  }

  populateFilters() {
    const statusSelect = this.container.querySelector('#flora-status');
    if (statusSelect) {
      statusSelect.innerHTML = '<option value="">Estado</option>';
      ESTADOS_CONSERVACION.forEach((st) => {
        const opt = document.createElement('option');
        opt.value = st;
        opt.textContent = st;
        statusSelect.appendChild(opt);
      });
    }

    const letterDiv = this.container.querySelector('#flora-letter');
    if (!letterDiv) return;
    letterDiv.innerHTML = '<button class="letter-btn active" data-letter="">Todas</button>';
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      const btn = document.createElement('button');
      btn.className = 'letter-btn';
      btn.textContent = letter;
      btn.dataset.letter = letter;
      btn.addEventListener('click', () => {
        const all = letterDiv.querySelectorAll('.letter-btn');
        all.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.filters.letter = letter;
        this.applyFilters();
      });
      letterDiv.appendChild(btn);
    }
  }

  applyFilters() {
    const q = this.filters.query && this.filters.query.toLowerCase();
    const st = this.filters.status;
    const lt = this.filters.letter;

    this.filtered = this.plantas.filter((p) => {
      const name = (p.nombre_comun || p.nombre_cientifico || '').toString();
      const matchQuery = !q || name.toLowerCase().includes(q);
      const matchStatus = !st || (p.estado && p.estado === st);
      const matchLetter = !lt || (name && name.toUpperCase().startsWith(lt));
      return matchQuery && matchStatus && matchLetter;
    });

    this.renderGallery();
  }

  renderGallery() {
    const gallery = this.container.querySelector('#flora-gallery');
    const empty = this.container.querySelector('#flora-empty');
    const error = this.container.querySelector('#flora-error');
    if (!gallery) return;

    error.style.display = 'none';
    empty.style.display = 'none';
    gallery.style.display = 'grid';

    if (!this.filtered || this.filtered.length === 0) {
      gallery.style.display = 'none';
      empty.style.display = 'block';
      return;
    }

    gallery.innerHTML = this.filtered.map((p) => {
      const id = p.id_planta || p.id || p.pk || '';
      const img = p.foto_principal || p.url_foto || p.image || '/placeholder-species.png';
      const estado = p.estado || '';
      return `
        <div class="gallery-item" data-id="${id}">
          <div class="gallery-item-image">
            <img src="${img}" alt="${(p.nombre_comun || p.nombre_cientifico) || 'Planta'}" />
            <div class="gallery-item-overlay">
              <button class="gallery-item-btn">Ver detalles</button>
            </div>
          </div>
          <div class="gallery-item-info">
            <h3 class="gallery-item-name">${p.nombre_comun || 'Sin nombre'}</h3>
            <p class="gallery-item-meta">
              ${estado ? `<span class="gallery-item-status">${estado}</span>` : ''}
            </p>
          </div>
        </div>
      `;
    }).join('');

    gallery.querySelectorAll('.gallery-item').forEach((item) => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        if (!id) return;
        window.location.hash = `/flora/${id}`;
      });
    });
  }

  showLoading() {
    const l = this.container.querySelector('#flora-loading');
    const g = this.container.querySelector('#flora-gallery');
    if (l) l.style.display = 'block';
    if (g) g.style.display = 'none';
  }

  hideLoading() {
    const l = this.container.querySelector('#flora-loading');
    if (l) l.style.display = 'none';
  }

  showError(msg) {
    const e = this.container.querySelector('#flora-error');
    const g = this.container.querySelector('#flora-gallery');
    if (e) {
      e.innerHTML = '';
      const txt = document.createElement('span');
      txt.textContent = msg;
      e.appendChild(txt);
      const btn = document.createElement('button');
      btn.id = 'flora-retry';
      btn.className = 'btn-retry';
      btn.textContent = 'Reintentar';
      btn.addEventListener('click', () => this.loadPlantas());
      e.appendChild(document.createTextNode(' '));
      e.appendChild(btn);
      e.style.display = 'block';
    }
    if (g) g.style.display = 'none';
  }
}

export default async function render(container, params = {}) {
  const page = new FloraPage(container);
  await page.init();
}

