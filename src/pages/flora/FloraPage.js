/**
 * @fileoverview Página de flora (galería de plantas)
 * @module pages/flora/FloraPage
 */

import { createLink } from '../../router/router.js';
import { getPlantas } from '../../services/floraService.js';
import { loadGallery } from '../../components/gallery/Gallery.js';

/**
 * Renderiza la página de flora
 * @param {HTMLElement} container - Contenedor de la página
 */
export function render(container) {
  container.innerHTML = `
    <div class="flora-page">
      <header class="page-header">
        <nav class="breadcrumb">
          ${createLink('/', '← Inicio')}
        </nav>
        <h1>🌺 Flora de Panamá</h1>
        <p>Explora las plantas protegidas de nuestro país</p>
      </header>
      
      <section class="filters-section" id="flora-filters">
        <!-- FilterBar component will be rendered here -->
        <div class="filters-placeholder">
          <p>Filtros: Búsqueda | Estado | Letra (por implementar)</p>
        </div>
      </section>
      
      <section class="gallery-section" id="flora-gallery">
        <!-- Gallery component with FlipCards will be rendered here -->
      </section>
    </div>
  `;

  // Cargar datos de flora desde la API
  const galleryContainer = container.querySelector('#flora-gallery');

  // Wrapper que intenta obtener datos reales y, si falla, devuelve datos de ejemplo
  async function fetchPlantasWithFallback(params = {}) {
    try {
      const res = await getPlantas(params);
      // soportar array directo o respuesta paginada { results: [] }
      return Array.isArray(res) ? res : (res?.results || res?.items || []);
    } catch (err) {
      console.warn('getPlantas failed, using fallback data', err);
      // Datos de ejemplo simples para desarrollo local
      return [
        {
          id_planta: 1,
          nombre_comun: 'Orquídea Fantasía',
          nombre_cientifico: 'Orchidia imaginaria',
          url_foto: '/assets/sample_orchid.jpg',
          descripcion: 'Flor epífita común en bosques húmedos.'
        },
        {
          id_planta: 2,
          nombre_comun: 'Guayacán',
          nombre_cientifico: 'Tabebuia chrysantha',
          url_foto: '/assets/sample_tree.jpg',
          descripcion: 'Árbol nativo con flores amarillas.'
        },
        {
          id_planta: 3,
          nombre_comun: 'Helecho de la selva',
          nombre_cientifico: 'Pteridophyta panamensis',
          url_foto: '/assets/sample_fern.jpg',
          descripcion: 'Helecho terrestre de frondas grandes.'
        }
      ];
    }
  }

  // Usar el wrapper para cargar la galería (solo cambia comportamiento en Flora)
  loadGallery(galleryContainer, fetchPlantasWithFallback, {}, { type: 'flora', size: 'md' });
}

export default { render };
