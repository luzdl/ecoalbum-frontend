/**
 * @fileoverview Página de flora (galería de plantas)
 * @module pages/flora/FloraPage
 */

import { createLink } from '../../router/router.js';

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
        <div class="gallery-placeholder">
          <p>Galería de tarjetas de flora (por implementar)</p>
          <div class="placeholder-grid">
            ${Array(6).fill(0).map((_, i) => `
              <div class="placeholder-card">
                <div class="placeholder-img"></div>
                <p>Planta ${i + 1}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    </div>
  `;
}

export default { render };
