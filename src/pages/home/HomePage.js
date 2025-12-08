/**
 * @fileoverview Página de inicio
 * @module pages/home/HomePage
 */

import { createLink } from '../../router/router.js';
import { mountNewsCarousel } from '../../components/carousels/NewsCarousel.js';
import { mountGalleryCarousel } from '../../components/carousels/GalleryCorousel.js';
import { getDestacados, getAleatorios } from '../../services/galleryService.js';

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
        <div id="news-carousel-container" class="carousel-placeholder">
          <p>Cargando noticias...</p>
        </div>
      </section>
      
      <section class="home-section" id="gallery-carousel">
        <h2>📸 Galería</h2>
        <div id="gallery-carousel-container" class="carousel-placeholder">
          <p>Cargando galería...</p>
        </div>
      </section>
    </div>
  `;

  // Cargar carruseles después de renderizar
  loadCarousels(container);
}

/**
 * Carga los datos de los carruseles desde la API
 * @param {HTMLElement} container - Contenedor principal
 */
async function loadCarousels(container) {
  try {
    // Cargar galería destacada (para noticias/featured)
    const newsContainer = container.querySelector('#news-carousel-container');
    const galleryContainer = container.querySelector('#gallery-carousel-container');

    // Obtener fotos destacadas para el carrusel de noticias
    const destacados = await getDestacados({ limit: 5 });
    if (destacados && destacados.length > 0) {
      const newsItems = destacados.map(foto => ({
        title: foto.nombre,
        excerpt: foto.descripcion_foto,
        cover: foto.url_foto,
        tag: foto.tipo === 'fauna' ? '🦁 Fauna' : '🌿 Flora',
        date: new Date(),
        href: `#/${foto.tipo}/${foto.especie_id}`,
      }));
      mountNewsCarousel(newsContainer, newsItems, { autoplay: true, glass: true });
    } else {
      newsContainer.innerHTML = '<p>No hay noticias destacadas disponibles</p>';
    }

    // Obtener fotos aleatorias para la galería
    const aleatorios = await getAleatorios({ limit: 8 });
    if (aleatorios && aleatorios.length > 0) {
      const galleryItems = aleatorios.map(foto => ({
        title: foto.nombre,
        caption: foto.descripcion_foto,
        cover: foto.url_foto,
        href: `#/${foto.tipo}/${foto.especie_id}`,
      }));
      mountGalleryCarousel(galleryContainer, galleryItems, { autoplay: false, glass: false });
    } else {
      galleryContainer.innerHTML = '<p>No hay fotos disponibles</p>';
    }
  } catch (error) {
    console.error('Error cargando carruseles:', error);
    const newsContainer = container.querySelector('#news-carousel-container');
    const galleryContainer = container.querySelector('#gallery-carousel-container');
    newsContainer.innerHTML = `<p>Error al cargar noticias: ${error.message}</p>`;
    galleryContainer.innerHTML = `<p>Error al cargar galería: ${error.message}</p>`;
  }
}

export default { render };
