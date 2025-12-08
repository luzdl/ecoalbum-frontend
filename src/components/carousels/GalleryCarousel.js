/**
 * GalleryCarousel – carrusel para galería con links
 * API:
 *  mountGalleryCarousel(container, items, options?)
 *  items: [{ title, caption?, cover, href }]
 */

export function mountGalleryCarousel(container, items = [], options = {}) {
  const opts = {
    autoplay: false,
    glass: false,
    ...options,
  };

  const root = document.createElement('section');
  root.className = `carousel${opts.glass ? ' glass' : ''}`;
  root.setAttribute('role', 'region');
  root.setAttribute('aria-roledescription', 'carrusel de galería');

  root.innerHTML = `
    <div class="carousel-viewport" aria-live="polite"></div>
    <div class="carousel-nav">
      <button class="carousel-btn carousel-btn-prev" aria-label="Anterior">‹</button>
      <button class="carousel-btn carousel-btn-next" aria-label="Siguiente">›</button>
      <div class="carousel-dots" role="tablist" aria-label="Paginación"></div>
    </div>
  `;

  const viewport = root.querySelector('.carousel-viewport');
  const dots = root.querySelector('.carousel-dots');

  items.forEach((it, i) => {
    const slide = document.createElement('article');
    slide.className = 'carousel-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-label', `${i + 1} de ${items.length}`);

    slide.innerHTML = `
      <a href="${it.href ?? '#'}" class="media-link">
        <img class="carousel-cover" src="${it.cover ?? ''}" alt="${it.title ? 'Imagen: ' + it.title : 'Imagen'}">
      </a>
      <div class="carousel-body">
        <h3 class="carousel-title">${it.title ?? ''}</h3>
        ${it.caption ? `<p class="carousel-subtitle">${it.caption}</p>` : ''}
        <div class="carousel-actions">
          <a class="btn" href="${it.href ?? '#'}">Abrir</a>
          <a class="btn btn-outline" href="${it.href ?? '#'}" download data-no-flip="true">Descargar</a>
        </div>
      </div>
    `;
    viewport.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.type = 'button';
    dot.addEventListener('click', () => goTo(i));
    dots.appendChild(dot);
  });

  let index = 0;
  const count = items.length;

  function goTo(i) {
    index = (i + count) % count;
    root.style.setProperty('--x', `${-100 * index}%`);
    updateDots();
  }
  function updateDots() {
    dots.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
  }

  root.querySelector('.carousel-btn-prev').addEventListener('click', () => goTo(index - 1));
  root.querySelector('.carousel-btn-next').addEventListener('click', () => goTo(index + 1));

  attachDrag(root, viewport, () => index, (i) => goTo(i));

  goTo(0);

  container.innerHTML = '';
  container.appendChild(root);
  return root;
}

/** Drag táctil/mouse simple (compartido) */
function attachDrag(root, viewport, getIndex, goTo) {
  let startX = 0, dx = 0, dragging = false;

  const onDown = (x) => { dragging = true; startX = x; dx = 0; root.dataset.dragging = 'true'; };
  const onMove = (x) => {
    if (!dragging) return;
    dx = x - startX;
    const pct = (-100 * getIndex()) + (dx / root.clientWidth) * 100;
    root.style.setProperty('--x', `${pct}%`);
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false; root.dataset.dragging = 'false';
    const threshold = root.clientWidth * 0.15;
    if (dx > threshold) goTo(getIndex() - 1);
    else if (dx < -threshold) goTo(getIndex() + 1);
    else goTo(getIndex());
  };

  root.addEventListener('mousedown', (e) => onDown(e.clientX));
  window.addEventListener('mousemove', (e) => onMove(e.clientX));
  window.addEventListener('mouseup', onUp);

  root.addEventListener('touchstart', (e) => onDown(e.touches[0].clientX), { passive: true });
  root.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
  root.addEventListener('touchend', onUp);
}
