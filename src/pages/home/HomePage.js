/**
 * @fileoverview Página de inicio
 * @module pages/home/HomePage
 */

import { createLink } from '../../router/router.js';

/**
 * Renderiza la página de inicio
 * @param {HTMLElement} container - Contenedor de la página
 */
export function render(container) {
  container.innerHTML = `
    <div class="home-page">
      <section class="hero">
        <h1>🌿 EcoAlbum Panamá</h1>
        <p>Catálogo de fauna y flora protegida de Panamá</p>
      </section>
      
      <nav class="home-nav">
        ${createLink('/fauna', '🦁 Explorar Fauna', 'btn btn-primary')}
        ${createLink('/flora', '🌺 Explorar Flora', 'btn btn-secondary')}
      </nav>
      
      <section class="home-section" id="news-carousel">
        <h2>📰 Noticias Destacadas</h2>
        <div class="carousel-placeholder">
          <!-- NewsCarousel component will be rendered here -->
          <p>Carrusel de noticias (por implementar)</p>
        </div>
      </section>
      
      <section class="home-section" id="gallery-carousel">
        <h2>📸 Galería</h2>
        <div class="carousel-placeholder">
          <!-- GalleryCarousel component will be rendered here -->
          <p>Carrusel de galería (por implementar)</p>
        </div>
      </section>
    </div>
  `;
}

export default { render };
