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
  loadGallery(galleryContainer, getPlantas, {}, { type: 'flora', size: 'md' });
}

export default { render };
