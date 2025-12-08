/**
 * @fileoverview Página de inicio
 * @module pages/home/HomePage
 */

import { createLink } from "../../router/router.js";
import { mountNewsCarousel } from "../../components/carousels/NewsCarousel.js";
import { mountGalleryCarousel } from "../../components/carousels/GalleryCarousel.js";
import { getDestacados, getAleatorios } from "../../services/galleryService.js";
import "./HomePage.css";

/**
 * Renderiza la página de inicio
 * @param {HTMLElement} container - Contenedor de la página
 */
export function render(container) {
  container.innerHTML = `
    <div class="home-page">
      <section class="hero card card--glass elev-2">
        <h1 class="hero__title">🌿 EcoAlbum Panamá</h1>
        <p class="hero__subtitle">Catálogo de fauna y flora protegida de Panamá</p>
        <nav class="home-nav">
          ${createLink("/fauna", "🦁 Explorar Fauna", "btn btn-primary")}
          ${createLink("/flora", "🌺 Explorar Flora", "btn btn-secondary")}
        </nav>
      </section>

      <section class="home-section">
        <h2 class="section-title">Especies Destacadas</h2>
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
        <h2 class="section-title">📰 Noticias Destacadas</h2>
        <div id="news-carousel-container" class="carousel-placeholder">
          <p>Cargando noticias…</p>
        </div>
      </section>

      <section class="home-section" id="gallery-carousel">
        <h2 class="section-title">📸 Galería</h2>
        <div id="gallery-carousel-container" class="carousel-placeholder">
          <p>Cargando galería…</p>
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
  const newsContainer = container.querySelector("#news-carousel-container");
  const galleryContainer = container.querySelector("#gallery-carousel-container");

  // AbortController para cancelar si el usuario navega
  const ctl = new AbortController();
  const { signal } = ctl;
  container.__abort = () => ctl.abort();

  // 1) Carrusel de noticias: Fotos destacadas con formato de noticias
  try {
    const destacados = await getDestacados({ limit: 5, signal });
    if (Array.isArray(destacados) && destacados.length > 0) {
      const newsItems = destacados.map((foto) => ({
        title: foto.nombre,
        excerpt: foto.descripcion_foto || "Especie destacada",
        cover: foto.url_foto,
        tag: foto.tipo === "fauna" ? "🦁 Fauna" : "🌿 Flora",
        date: new Date(),
        href: `#/${foto.tipo}/${foto.especie_id}`,
      }));
      mountNewsCarousel(newsContainer, newsItems, {
        autoplay: true,
        interval: 5000,
        glass: true,
      });
    } else {
      newsContainer.innerHTML = "<p>No hay noticias destacadas disponibles</p>";
    }
  } catch (error) {
    if (signal.aborted) return;
    console.error("Error cargando noticias:", error);
    newsContainer.innerHTML = `<p class="load-error">Error al cargar noticias: ${error.message}</p>`;
  }

  // 2) Carrusel de galería: Fotos aleatorias desde la API
  try {
    const aleatorios = await getAleatorios({ limit: 10, signal });
    if (Array.isArray(aleatorios) && aleatorios.length > 0) {
      const galleryItems = aleatorios.map((foto) => ({
        title: foto.nombre,
        caption: foto.descripcion_foto || foto.nombre_cientifico,
        cover: foto.url_foto,
        href: `#/${foto.tipo}/${foto.especie_id}`,
      }));
      mountGalleryCarousel(galleryContainer, galleryItems, {
        autoplay: false,
        glass: false,
      });
    } else {
      galleryContainer.innerHTML = "<p>No hay fotos disponibles</p>";
    }
  } catch (error) {
    if (signal.aborted) return;
    console.error("Error cargando galería:", error);
    galleryContainer.innerHTML = `<p class="load-error">Error al cargar galería: ${error.message}</p>`;
  }
}

export default { render };
