/**
 * NewsCarousel – carrusel para noticias/destacados
 * API:
 *  mountNewsCarousel(container, items, options?)
 *  items: [{ title, excerpt, cover, href, tag?, date? }]
 */

import { createCarousel } from './CarouselCore.js';

function formatDate(d) {
  try {
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toLocaleDateString('es-PA', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return ''; }
}

export function mountNewsCarousel(container, items = [], options = {}) {
  const renderSlide = (item) => {
    const slide = document.createElement('article');
    slide.className = 'carousel-slide';
    slide.setAttribute('role', 'group');
    slide.innerHTML = `
      <img class="carousel-cover" src="${item.cover ?? ''}" alt="${item.title ? 'Imagen: ' + item.title : 'Imagen'}">
      <div class="carousel-body">
        ${item.tag ? `<span class="badge"><span class="badge-dot"></span>${item.tag}</span>` : ''}
        <h3 class="carousel-title">${item.title ?? ''}</h3>
        ${item.date ? `<p class="carousel-subtitle">${formatDate(item.date)}</p>` : ''}
        ${item.excerpt ? `<p>${item.excerpt}</p>` : ''}
        <div class="carousel-actions">
          <a class="btn" href="${item.href ?? '#'}">Leer más</a>
          <button class="btn btn-outline" type="button" data-no-flip="true" data-pause="true">Pausar</button>
        </div>
      </div>
    `;
    return slide;
  };

  return createCarousel(container, items, {
    autoplay: true,
    interval: 4500,
    glass: true,
    renderSlide,
    createDotLabel: (i) => `Noticia ${i + 1}`,
    ...options,
  });
}
