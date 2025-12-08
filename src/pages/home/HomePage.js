/**
 * @fileoverview Página de inicio
 * @module pages/home/HomePage
 */

import { createLink } from "../../router/router.js";
import { mountNewsCarousel } from "../../components/carousels/NewsCarousel.js";
import { mountGalleryCarousel } from "../../components/carousels/GalleryCarousel.js";
import { getDestacados, getAleatorios } from "../../services/galleryService.js";
import { createFlipCard, buildFront, buildBack } from "../../components/cards/FlipCard.js";
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
        <h2 class="section-title">🌟 Especies Destacadas</h2>
        <div id="featured-species-container" class="grid grid-3">
          <p class="loading-text">Cargando especies destacadas...</p>
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

  // Cargar datos desde la API
  loadHomeData(container);
}

/**
 * Mapea el estado de conservación a la clase CSS del badge
 * @param {string} estado - Estado de conservación
 * @returns {string} Clase CSS del badge
 */
function getEstadoBadgeClass(estado) {
  if (!estado) return 'badge';
  const estadoLower = estado.toLowerCase();
  if (estadoLower.includes('crítico') || estadoLower.includes('cr')) return 'badge badge-cr';
  if (estadoLower.includes('peligro') || estadoLower.includes('en')) return 'badge badge-en';
  if (estadoLower.includes('vulnerable') || estadoLower.includes('vu')) return 'badge badge-vu';
  if (estadoLower.includes('amenazado') || estadoLower.includes('nt')) return 'badge badge-nt';
  if (estadoLower.includes('preocupación') || estadoLower.includes('lc')) return 'badge badge-lc';
  return 'badge';
}

/**
 * Genera el HTML del badge de estado
 * @param {string} estado - Estado de conservación
 * @returns {string} HTML del badge
 */
function getStatusBadgeHTML(estado) {
  const badgeClass = getEstadoBadgeClass(estado);
  return `<div class="${badgeClass}"><span class="badge-dot"></span>${estado || 'Sin clasificar'}</div>`;
}

/**
 * Crea una FlipCard para una especie destacada
 * @param {Object} especie - Datos de la especie
 * @returns {HTMLElement} FlipCard element
 */
function createSpeciesFlipCard(especie) {
  const tipoIcon = especie.tipo === 'fauna' ? '🦁' : '🌿';
  const tipoLabel = especie.tipo === 'fauna' ? 'Fauna' : 'Flora';
  
  const front = buildFront({
    image: especie.url_foto,
    title: especie.nombre,
    subtitle: especie.nombre_cientifico || '',
    statusBadge: getStatusBadgeHTML(especie.estado)
  });

  const back = buildBack({
    paragraphs: [
      especie.descripcion_foto || `${tipoIcon} ${tipoLabel} de Panamá`,
    ],
    habitat: especie.tipo === 'fauna' ? 'Bosques y selvas de Panamá' : 'Ecosistemas panameños',
    actions: [
      {
        label: 'Ver detalles',
        href: `#/${especie.tipo}/${especie.especie_id}`,
        variant: 'btn-primary'
      }
    ]
  });

  return createFlipCard({
    front,
    back,
    size: 'md',
    glass: true,
    title: especie.nombre
  });
}

/**
 * Carga todos los datos de la página desde la API
 * @param {HTMLElement} container - Contenedor principal
 */
async function loadHomeData(container) {
  const featuredContainer = container.querySelector("#featured-species-container");
  const newsContainer = container.querySelector("#news-carousel-container");
  const galleryContainer = container.querySelector("#gallery-carousel-container");

  // AbortController para cancelar si el usuario navega
  const ctl = new AbortController();
  const { signal } = ctl;
  container.__abort = () => ctl.abort();

  // 1) Especies destacadas (FlipCards)
  try {
    const destacados = await getDestacados({ limit: 6, signal });
    if (Array.isArray(destacados) && destacados.length > 0) {
      featuredContainer.innerHTML = ''; // Limpiar el loading
      destacados.forEach(especie => {
        const flipCard = createSpeciesFlipCard(especie);
        featuredContainer.appendChild(flipCard);
      });
    } else {
      featuredContainer.innerHTML = '<p class="no-data">No hay especies destacadas disponibles</p>';
    }
  } catch (error) {
    if (signal.aborted) return;
    console.error("Error cargando especies destacadas:", error);
    featuredContainer.innerHTML = `<p class="load-error">Error al cargar especies: ${error.message}</p>`;
  }

  // 2) Carrusel de noticias: Fotos destacadas con formato de noticias
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

  // 3) Carrusel de galería: Fotos aleatorias desde la API
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
