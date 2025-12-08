/**
 * NewsCarousel – carrusel para noticias/destacados
 * API:
 *  mountNewsCarousel(container, items, options?)
 *  items: [{ title, excerpt, cover, href, tag?, date? }]
 */

export function mountNewsCarousel(container, items = [], options = {}) {
  const opts = {
    autoplay: true,
    interval: 4500,
    glass: true,
    ...options,
  };

  const root = document.createElement('section');
  root.className = `carousel${opts.glass ? ' glass' : ''}`;
  root.setAttribute('role', 'region');
  root.setAttribute('aria-roledescription', 'carrusel de noticias');

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

  // Slides
  items.forEach((it, i) => {
    const slide = document.createElement('article');
    slide.className = 'carousel-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-label', `${i + 1} de ${items.length}`);

    slide.innerHTML = `
      <img class="carousel-cover" src="${it.cover ?? ''}" alt="${it.title ? 'Imagen: ' + it.title : 'Imagen'}">
      <div class="carousel-body">
        ${it.tag ? `<span class="badge"><span class="badge-dot"></span>${it.tag}</span>` : ''}
        <h3 class="carousel-title">${it.title ?? ''}</h3>
        ${it.date ? `<p class="carousel-subtitle">${formatDate(it.date)}</p>` : ''}
        ${it.excerpt ? `<p>${it.excerpt}</p>` : ''}
        <div class="carousel-actions">
          <a class="btn" href="${it.href ?? '#'}">Leer más</a>
          <button class="btn btn-outline" type="button" data-no-flip="true" data-pause="true">Pausar</button>
        </div>
      </div>
    `;
    viewport.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-controls', `news-slide-${i}`);
    dot.addEventListener('click', () => goTo(i));
    dots.appendChild(dot);
  });

  // Estado
  let index = 0;
  let timer = null;
  const count = items.length;

  function goTo(i) {
    index = (i + count) % count;
    root.style.setProperty('--x', `${-100 * index}%`);
    updateDots();
  }

  function updateDots() {
    dots.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.setAttribute('aria-current', i === index ? 'true' : 'false');
      d.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  }

  // Controles
  root.querySelector('.carousel-btn-prev').addEventListener('click', () => goTo(index - 1));
  root.querySelector('.carousel-btn-next').addEventListener('click', () => goTo(index + 1));

  // Arrastre táctil
  attachDrag(root, viewport, () => index, (i) => goTo(i));

  // Autoplay
  const start = () => {
    if (!opts.autoplay) return;
    stop();
    timer = setInterval(() => goTo(index + 1), opts.interval);
  };
  const stop = () => timer && (clearInterval(timer), (timer = null));

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('click', (e) => {
    if (e.target.matches('[data-pause="true"]')) {
      if (timer) { stop(); e.target.textContent = 'Reanudar'; }
      else { start(); e.target.textContent = 'Pausar'; }
    }
  });

  // Teclado
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  // Init
  goTo(0);
  start();

  container.innerHTML = ''; // limpia placeholder
  container.appendChild(root);
  return root;
}

function formatDate(d) {
  try {
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toLocaleDateString('es-PA', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return ''; }
}

/** Drag táctil/mouse simple */
function attachDrag(root, viewport, getIndex, goTo) {
  let startX = 0, dx = 0, dragging = false;
  const count = viewport.children.length;

  const onDown = (x) => {
    dragging = true;
    startX = x;
    dx = 0;
    root.dataset.dragging = 'true';
  };
  const onMove = (x) => {
    if (!dragging) return;
    dx = x - startX;
    const pct = (-100 * getIndex()) + (dx / root.clientWidth) * 100;
    root.style.setProperty('--x', `${pct}%`);
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    root.dataset.dragging = 'false';
    const threshold = root.clientWidth * 0.15;
    if (dx > threshold) goTo(getIndex() - 1);
    else if (dx < -threshold) goTo(getIndex() + 1);
    else goTo(getIndex());
  };

  // mouse
  root.addEventListener('mousedown', (e) => onDown(e.clientX));
  window.addEventListener('mousemove', (e) => onMove(e.clientX));
  window.addEventListener('mouseup', onUp);
  // touch
  root.addEventListener('touchstart', (e) => onDown(e.touches[0].clientX), { passive: true });
  root.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
  root.addEventListener('touchend', onUp);
}
