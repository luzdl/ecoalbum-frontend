/**
 * GalleryCarousel – carrusel para galería con links
 * API:
 *  mountGalleryCarousel(container, items, options?)
 *  items: [{ title, caption?, cover, href }]
 */

import { createCarousel } from './CarouselCore.js';

export function mountGalleryCarousel(container, items = [], options = {}) {
  const renderSlide = (item) => {
    const slide = document.createElement('article');
    slide.className = 'carousel-slide';
    slide.setAttribute('role', 'group');
    slide.innerHTML = `
      <a href="${item.href ?? '#'}" class="media-link">
        <img class="carousel-cover" src="${item.cover ?? ''}" alt="${item.title ? 'Imagen: ' + item.title : 'Imagen'}">
      </a>
      <div class="carousel-body">
        <h3 class="carousel-title">${item.title ?? ''}</h3>
        ${item.caption ? `<p class="carousel-subtitle">${item.caption}</p>` : ''}
        <div class="carousel-actions">
          <a class="btn" href="${item.href ?? '#'}">Abrir</a>
          <a class="btn btn-outline" href="${item.href ?? '#'}" download data-no-flip="true">Descargar</a>
        </div>
      </div>
    `;
    return slide;
  };

  return createCarousel(container, items, {
    autoplay: false,
    glass: false,
    renderSlide,
    createDotLabel: (i) => `Imagen ${i + 1}`,
    ...options,
  });
}
