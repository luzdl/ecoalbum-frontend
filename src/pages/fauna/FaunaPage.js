/**
 * @fileoverview Página de fauna (galería de animales)
 * @module pages/fauna/FaunaPage
 */

import { createLink } from '../../router/router.js';
import { getAnimales } from '../../services/faunaService.js';
import { loadGallery } from '../../components/gallery/Gallery.js';

/**
 * Renderiza la página de fauna
 * @param {HTMLElement} container - Contenedor de la página
 */
export function render(container) {
  container.innerHTML = `
    <div class="fauna-page">
      <header class="page-header">
        <nav class="breadcrumb">
          ${createLink('/', '← Inicio')}
        </nav>
        <h1>🦁 Fauna de Panamá</h1>
        <p>Explora los animales protegidos de nuestro país</p>
      </header>
      
      <section class="filters-section" id="fauna-filters">
        <!-- FilterBar component will be rendered here -->
        <div class="filters-placeholder">
          <p>Filtros: Búsqueda | Categoría | Estado | Letra (por implementar)</p>
        </div>
      </section>
      
      <section class="gallery-section" id="fauna-gallery">
        <!-- Gallery component with FlipCards will be rendered here -->
      </section>
    </div>
  `;

  // Cargar datos de fauna desde la API
  const galleryContainer = container.querySelector('#fauna-gallery');
  loadGallery(galleryContainer, getAnimales, {}, { type: 'fauna', size: 'md' });
}

export default { render };
