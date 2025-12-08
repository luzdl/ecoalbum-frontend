/**
 * @fileoverview Página de fauna (galería de animales)
 * @module pages/fauna/FaunaPage
 */

import { createLink } from '../../router/router.js';

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
        <div class="gallery-placeholder">
          <p>Galería de tarjetas de fauna (por implementar)</p>
          <div class="placeholder-grid">
            ${Array(6).fill(0).map((_, i) => `
              <div class="placeholder-card">
                <div class="placeholder-img"></div>
                <p>Animal ${i + 1}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    </div>
  `;
}

export default { render };
