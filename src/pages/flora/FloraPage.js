/**
 * @fileoverview Página de flora (galería de plantas)
 * @module pages/flora/FloraPage
 */

import { createLink } from '../../router/router.js';
import { getPlantas, ESTADOS_CONSERVACION } from '../../services/floraService.js';
import { createFilterBar } from '../../components/filters/FilterBar.js';
import { loadGallery } from '../../components/gallery/Gallery.js';
import { createFlipCard, buildFront, buildBack } from '../../components/cards/FlipCard.js';
import './FloraPage.css';

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

/**
 * FloraPage - integra FilterBar + Gallery + PlantCard (FlipCard)
 * Usa `getPlantas` como fetchFn para `loadGallery`
 */
class FloraPage {
  constructor(container) {
    this.container = container;
    this.plantas = [];
    this.filtered = [];
    this.filters = { query: '', estado: '', letter: '' };
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
    const estadoSelect = document.getElementById('estado-filter');
    // search removed per UX request


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
      await this.applyFilters();
    } catch (err) {
      console.error('Error cargando plantas:', err);
      this.plantas = [];
      this.showError(err.message || 'Error al cargar plantas');
    } finally {
      this.loading = false;
    }
  }

  // Fetch detalle por planta
  async fetchFloraDetail(id) {
    if (!id) return null;
    try {
      const res = await fetch(`http://localhost:8000/api/flora/flora/${id}/`, { headers: { Accept: 'application/json' } });
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('Error fetching flora detail', id, err);
      return null;
    }
  }

  populateFilters() {
    // Usar estados hardcodeados
    const estSelect = document.getElementById('estado-filter');
    estSelect.innerHTML = `<option value="">Estado</option>`;
    Object.entries(STATUS_LABEL).forEach(([key, label]) => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = label;
      opt.style.color = STATUS_COLOR[key];
      estSelect.appendChild(opt);
    });

    const letterDiv = document.getElementById('letter-filter');
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

  async applyFilters() {
    this.filtered = this.plantas.filter((p) => {
      const name = p.nombre_comun || p.nombre_cientifico || '';
      const matchQuery = !this.filters.query || name.toLowerCase().includes(this.filters.query.toLowerCase());
      // Ya no filtramos por familia (no hay datos de familias fiables)
      // Comparar estado por código (lc, nt, vu, en, cr) - el campo estado contiene "(LC)", "(VU)", etc.
      const estadoField = p.estado || p.estado_conservacion || '';
      const matchEstado = !this.filters.estado || 
        (estadoField && estadoField.toLowerCase().includes(`(${this.filters.estado})`));
      const matchLetter = !this.filters.letter || name.toUpperCase().startsWith(this.filters.letter);
      return matchQuery && matchEstado && matchLetter;
    });

    await this.renderGallery();
  }

  async renderGallery() {
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

    // helper: estado badge
    const getEstadoBadgeHTML = (estado) => {
      if (!estado) return `<div class="badge">Sin clasificar</div>`;
      const s = String(estado || '').toUpperCase();
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

    // Pre-fetch detalles para cada planta
    const details = await Promise.all(this.filtered.map(async (p) => {
      const id = p.id_planta || p.id || p.pk || '';
      return await this.fetchFloraDetail(id);
    }));

    gallery.innerHTML = '';
    const frag = document.createDocumentFragment();

    this.filtered.forEach((p, idx) => {
      const id = p.id_planta || p.id || p.pk || '';
      const img = p.foto_principal || p.url_foto || p.imagen || p.url || '/placeholder-species.png';
      const nombre = p.nombre_comun || p.nombre_cientifico || 'Sin nombre';
      const estado = p.estado || p.estado_conservacion || '';
      const detail = details[idx] || {};

      const front = buildFront({ image: img, title: nombre, subtitle: p.nombre_cientifico || '' });
      const back = buildBack({
        statusBadge: getEstadoBadgeHTML(estado),
        // Mostrar solo el campo 'distribucion' desde el detalle cuando exista
        paragraphs: [ (detail.distribucion && detail.distribucion.trim()) || (p.distribucion && p.distribucion.trim()) || (p.descripcion && p.descripcion.trim()) || 'Especie de flora registrada en Panamá.' ],
        habitat: detail.habitat || p.habitat || '',
        region: detail.region || p.region || '',
        actions: [ { label: 'Ver detalles', href: `#/flora/${id}`, variant: 'btn-primary' } ]
      });

      const card = createFlipCard({ front, back, size: 'md', title: nombre });
      frag.appendChild(card);
    });

    gallery.appendChild(frag);
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

