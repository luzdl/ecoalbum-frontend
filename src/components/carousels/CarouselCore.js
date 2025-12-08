/**
 * CarouselCore - Lógica centralizada para carruseles con loop infinito
 * Maneja navegación, autoplay, arrastre táctil y transiciones suaves
 */

export function createCarousel(container, items, options = {}) {
  const opts = {
    autoplay: false,
    interval: 4500,
    glass: false,
    renderSlide: null, // Función para renderizar cada slide
    createDotLabel: (i) => `Slide ${i + 1}`,
    ...options,
  };

  if (!opts.renderSlide || items.length === 0) {
    console.warn('CarouselCore: renderSlide function required and items must not be empty');
    return null;
  }

  const root = document.createElement('section');
  root.className = `carousel${opts.glass ? ' glass' : ''}`;
  root.setAttribute('role', 'region');
  root.setAttribute('aria-roledescription', 'carrusel');

    root.innerHTML = `
    <div class="carousel-inner">
        <div class="carousel-viewport" aria-live="polite"></div>
        <div class="carousel-nav">
        <button class="carousel-btn carousel-btn-prev" aria-label="Anterior">
            <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32" fill="currentColor">
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
            </svg>
        </button>
        <button class="carousel-btn carousel-btn-next" aria-label="Siguiente">
            <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32" fill="currentColor">
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
            </svg>
        </button>
        </div>
    </div>
    <div class="carousel-dots" role="tablist" aria-label="Paginación"></div>
    `;

  const viewport = root.querySelector('.carousel-viewport');
  const dots = root.querySelector('.carousel-dots');

  // Clone last slide at beginning for seamless loop
  if (items.length > 0) {
    const clonedLastSlide = opts.renderSlide(items[items.length - 1], items.length - 1, items.length);
    clonedLastSlide.setAttribute('aria-hidden', 'true');
    viewport.appendChild(clonedLastSlide);
  }

  // Add all slides and dots
  items.forEach((item, i) => {
    const slide = opts.renderSlide(item, i, items.length);
    viewport.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', opts.createDotLabel(i));
    dot.addEventListener('click', () => goTo(i, false));
    dots.appendChild(dot);
  });

  // Clone first slide at end for seamless loop
  if (items.length > 0) {
    const clonedFirstSlide = opts.renderSlide(items[0], 0, items.length);
    clonedFirstSlide.setAttribute('aria-hidden', 'true');
    viewport.appendChild(clonedFirstSlide);
  }

  // Estado
  let index = 0;
  let timer = null;
  const count = items.length;
  let transitioning = false;

  function goTo(targetIndex, animate = true) {
    if (transitioning) return;
    
    index = (targetIndex + count) % count;
    const position = index + 1;
    
    if (!animate) {
      viewport.style.transition = 'none';
      root.style.setProperty('--x', `${-100 * position}%`);
      viewport.offsetHeight;
      viewport.style.transition = '';
    } else {
      root.style.setProperty('--x', `${-100 * position}%`);
    }
    
    updateDots();
  }
  
  function advance(direction) {
    if (transitioning) return;
    
    transitioning = true;
    const nextIndex = index + direction;
    const nextPosition = nextIndex + 1;
    
    root.style.setProperty('--x', `${-100 * nextPosition}%`);
    
    const handleTransitionEnd = () => {
      viewport.removeEventListener('transitionend', handleTransitionEnd);
      transitioning = false;
      
      if (nextPosition === 0) {
        index = count - 1;
        goTo(index, false);
      } else if (nextPosition === count + 1) {
        index = 0;
        goTo(index, false);
      } else {
        index = (nextIndex + count) % count;
        updateDots();
      }
    };
    
    viewport.addEventListener('transitionend', handleTransitionEnd);
  }

  function updateDots() {
    dots.querySelectorAll('.carousel-dot').forEach((d, i) => {
      const isCurrent = i === index;
      d.setAttribute('aria-current', isCurrent ? 'true' : 'false');
      d.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });
  }

  // Controles
  root.querySelector('.carousel-btn-prev').addEventListener('click', () => advance(-1));
  root.querySelector('.carousel-btn-next').addEventListener('click', () => advance(1));

  // Arrastre táctil
  attachDrag(root, viewport, () => index, (dir) => {
    if (dir < 0) advance(-1);
    else if (dir > 0) advance(1);
    else goTo(index, true);
  });

  // Autoplay
  const start = () => {
    if (!opts.autoplay) return;
    stop();
    timer = setInterval(() => advance(1), opts.interval);
  };
  const stop = () => timer && (clearInterval(timer), (timer = null));

  if (opts.autoplay) {
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
  }

  // Botón pausar (opcional)
  root.addEventListener('click', (e) => {
    if (e.target.matches('[data-pause="true"]')) {
      if (timer) {
        stop();
        e.target.textContent = 'Reanudar';
      } else {
        start();
        e.target.textContent = 'Pausar';
      }
    }
  });

  // Teclado
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') advance(-1);
    if (e.key === 'ArrowRight') advance(1);
  });

  // Init
  goTo(0, false);
  start();

  container.innerHTML = '';
  container.appendChild(root);
  
  return {
    root,
    goTo,
    advance,
    start,
    stop,
    getCurrentIndex: () => index,
  };
}

/** Drag táctil/mouse */
function attachDrag(root, viewport, getIndex, onSwipe) {
  let startX = 0, dx = 0, dragging = false;

  const onDown = (x) => {
    dragging = true;
    startX = x;
    dx = 0;
    root.dataset.dragging = 'true';
  };

  const onMove = (x) => {
    if (!dragging) return;
    dx = x - startX;
    const pct = (-100 * (getIndex() + 1)) + (dx / root.clientWidth) * 100;
    root.style.setProperty('--x', `${pct}%`);
  };

  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    root.dataset.dragging = 'false';
    const threshold = root.clientWidth * 0.15;
    if (dx > threshold) onSwipe(-1);
    else if (dx < -threshold) onSwipe(1);
    else onSwipe(0);
  };

  root.addEventListener('mousedown', (e) => onDown(e.clientX));
  window.addEventListener('mousemove', (e) => onMove(e.clientX));
  window.addEventListener('mouseup', onUp);

  root.addEventListener('touchstart', (e) => onDown(e.touches[0].clientX), { passive: true });
  root.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
  root.addEventListener('touchend', onUp);
}
