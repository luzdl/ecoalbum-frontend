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

/* ===========================
   Helpers de estado/badges
   =========================== */

/** Mapea el estado a clases CSS de badge */
function getEstadoBadgeClass(estado) {
  if (!estado) return "badge";
  const s = String(estado).toLowerCase();
  if (s.includes("cr") || s.includes("crítico")) return "badge badge-cr";
  if (s.includes("en") || s.includes("peligro")) return "badge badge-en";
  if (s.includes("vu") || s.includes("vulnerable")) return "badge badge-vu";
  if (s.includes("nt") || s.includes("amenaz")) return "badge badge-nt";
  if (s.includes("lc") || s.includes("preocupación") || s.includes("preocupacion"))
    return "badge badge-lc";
  return "badge";
}

/** HTML del badge de estado */
/** Deriva una clase de badge a partir del texto que viene de la API */
function estadoClassFromString(estado) {
  if (!estado) return 'badge';
  const s = String(estado).toUpperCase();
  // Buscar códigos comúnmente usados
  const codeMatch = s.match(/\b(LC|NT|VU|EN|CR)\b/i);
  if (codeMatch) return `badge badge-${codeMatch[1].toLowerCase()}`;
  // Fallback a palabras clave
  if (s.includes('CRÍT') || s.includes('CRITIC')) return 'badge badge-cr';
  if (s.includes('EN PELIG') || s.includes('EN PELIGRO')) return 'badge badge-en';
  if (s.includes('VULN') || s.includes('VULNER')) return 'badge badge-vu';
  if (s.includes('AMENAZ') || s.includes('CASI')) return 'badge badge-nt';
  if (s.includes('PREOCUP') || s.includes('LC')) return 'badge badge-lc';
  return 'badge';
}

function getStatusBadgeHTML(estado) {
  const cls = estadoClassFromString(estado);
  const text = estado || 'Sin clasificar';
  return `<div class="${cls}" data-estado="${String(estado || '').replace(/\"/g,'')}"><span class="badge-dot"></span>${text}</div>`;
}

/* ===========================
   Construcción de FlipCards
   =========================== */

/** Crea una FlipCard (front: imagen/títulos, back: estado+descripción+acciones) */
function createSpeciesFlipCard(especie) {
  // FRONT — solo imagen + títulos
  const front = buildFront({
    image: especie.url_foto,
    title: especie.nombre,
    subtitle: especie.nombre_cientifico || "",
  });

  // BACK — fondo blanco (lo da el CSS) + estado + descripción
  const back = buildBack({
    // badge arriba
    statusBadge: getStatusBadgeHTML(especie.estado),
    // cuerpo de texto (si no hay, un fallback claro)
    paragraphs: [
      especie.descripcion_foto?.trim() ||
        `Especie ${especie.tipo === "fauna" ? "de fauna" : "de flora"} registrada en Panamá.`,
    ],
    // meta (opcional)
    habitat: especie.habitat || (especie.tipo === "fauna" ? "Bosques y selvas de Panamá" : "Ecosistemas panameños"),
    region: especie.region || "Panamá",
    // acciones (además se asegura un fallback en FlipCard)
      actions: [
      {
        label: "Ver detalles",
        href: `#/${especie.tipo}/${especie.especie_id}?from=home`,
        variant: "btn-primary",
      },
    ],
  });

  // Crear FlipCard final
  return createFlipCard({
    front,
    back,
    size: "md",
    title: especie.nombre,
    // el CSS ya fuerza back con fondo blanco; no usamos glass en el flip
  });
}

/* ===========================
   Carga de datos
   =========================== */

async function loadHomeData(container) {
  const featuredContainer = container.querySelector("#featured-species-container");
  const newsContainer = container.querySelector("#news-carousel-container");
  const galleryContainer = container.querySelector("#gallery-carousel-container");

  // AbortController para cancelar si el usuario navega
  const ctl = new AbortController();
  const { signal } = ctl;
  container.__abort = () => ctl.abort();

  /* 1) Especies destacadas (FlipCards) */
  try {
    const destacados = await getDestacados({ limit: 6, signal });
    if (Array.isArray(destacados) && destacados.length > 0) {
      featuredContainer.innerHTML = "";
      destacados.forEach((especie) => {
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

  /* 2) Carrusel de noticias */
  try {
    const destacados = await getDestacados({ limit: 5, signal });
    if (Array.isArray(destacados) && destacados.length > 0) {
      const newsItems = destacados.map((foto) => ({
        title: foto.nombre,
        excerpt: foto.descripcion_foto || "Especie destacada",
        cover: foto.url_foto,
        tag: foto.tipo === "fauna" ? "🦁 Fauna" : "🌿 Flora",
        date: new Date(),
        href: `#/${foto.tipo}/${foto.especie_id}?from=home`,
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

  /* 3) Carrusel de galería */
  try {
    const aleatorios = await getAleatorios({ limit: 10, signal });
    if (Array.isArray(aleatorios) && aleatorios.length > 0) {
      const galleryItems = aleatorios.map((foto) => ({
        title: foto.nombre,
        caption: foto.descripcion_foto || foto.nombre_cientifico,
        cover: foto.url_foto,
        href: `#/${foto.tipo}/${foto.especie_id}?from=home`,
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
