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

      <section class="home-section">
        <h2>Especies Destacadas</h2>
        <div class="grid grid-3">
          <article class="card card--glass elev-2">
            <div class="card-header">
              <h3 class="card-title">Jaguar (Panthera onca)</h3>
              <p class="card-subtitle">Mamífero | Selva tropical</p>
            </div>
            <div class="badge badge-en">
              <span class="badge-dot"></span>
              En peligro
            </div>
            <p class="mt-4">
              Felino emblemático de América. Clave en el equilibrio de la cadena trófica.
            </p>
          </article>

          <article class="card elev-1">
            <div class="card-header">
              <h3 class="card-title">Perezoso</h3>
              <p class="card-subtitle">Mamífero | Bosque húmedo</p>
            </div>
            <div class="badge badge-vu">
              <span class="badge-dot"></span>
              Vulnerable
            </div>
            <p class="mt-4">Mamífero arborícola de movimientos lentos.</p>
          </article>
        </div>
      </section>
      
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
