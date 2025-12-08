/**
 * FlipCard base (vanilla JS + accesible)
 * FRONT: solo cover + títulos
 * BACK: badge + párrafos + meta + acciones + "Volver"
 *
 * Fallbacks:
 * - Si no se provee 'back' o no hay .flip-actions, se inyecta "Aprender más" + "Volver".
 */

export function createFlipCard({
  front,
  back,
  size = 'md',
  title = '',
  moreHref = '#',
  moreLabel = 'Aprender más',
} = {}) {
  const root = document.createElement('article');
  root.className = `flip-card flip-${size}`;
  root.setAttribute('tabindex', '0');
  if (title) root.setAttribute('aria-label', title);

  root.innerHTML = `
    <div class="flip-card-inner" aria-live="polite">
      <div class="flip-card-front" part="front"></div>
      <div class="flip-card-back" part="back"></div>
    </div>
  `;

  const frontSlot = root.querySelector('.flip-card-front');
  const backSlot  = root.querySelector('.flip-card-back');

  if (front instanceof HTMLElement) frontSlot.appendChild(front);
  if (back  instanceof HTMLElement) backSlot.appendChild(back);

  const toggle = () => root.classList.toggle('is-flipped');

  // Click/tap en la tarjeta (ignorar elementos con data-no-flip)
  root.addEventListener('click', (e) => {
    const noFlip = e.target.closest('[data-no-flip="true"]');
    if (noFlip) {
      e.stopPropagation();
      return;
    }
    toggle();
  });

  // Teclado
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    if (e.key === 'Escape') root.classList.remove('is-flipped');
  });

  return root;
}

/** FRONT: SOLO imagen + títulos (sin badge) */
export function buildFront({ image, title, subtitle }) {
  const wrap = document.createElement('div');

  if (image) {
    const img = document.createElement('img');
    img.className = 'flip-cover';
    img.src = image;
    img.alt = title ? `Imagen de ${title}` : 'Imagen';
    wrap.appendChild(img);
  }

  const body = document.createElement('div');
  body.className = 'flip-body';
  body.innerHTML = `
    <h3 class="flip-title">${title ?? ''}</h3>
    ${subtitle ? `<p class="flip-subtitle">${subtitle}</p>` : ''}
  `;
  wrap.appendChild(body);

  return wrap;
}

/**
 * BACK: badge de estado (HTML), párrafos, meta (hábitat/región) y acciones opcionales
 * params:
 * - statusBadge: string HTML (opcional)
 * - paragraphs: string[] (opcional)
 * - habitat, region: string (opcionales)
 * - actions: [{label, href?, variant?}] (opcional)
 */
export function buildBack({ statusBadge, paragraphs = [], habitat, region, actions = [] }) {
  const wrap = document.createElement('div');
  wrap.className = 'flip-body';

  if (statusBadge) {
    const holder = document.createElement('div');
    holder.innerHTML = statusBadge;
    const badgeEl = holder.firstElementChild;
    if (badgeEl) wrap.appendChild(badgeEl);
  }

  if (paragraphs.length) {
    paragraphs.forEach(t => {
      const p = document.createElement('p');
      p.textContent = t;
      wrap.appendChild(p);
    });
  }

  if (habitat || region) {
    const meta = document.createElement('p');
    meta.className = 'flip-subtitle';
    meta.textContent = `${habitat ? `Hábitat: ${habitat}` : ''}${habitat && region ? ' · ' : ''}${region ? `Región: ${region}` : ''}`;
    wrap.appendChild(meta);
  }

  const bar = document.createElement('div');
  bar.className = 'flip-actions';

  if (Array.isArray(actions) && actions.length) {
    actions.forEach(a => {
      const btn = document.createElement(a.onClick ? 'button' : (a.href ? 'a' : 'button'));
      if (a.href) btn.href = a.href;
      btn.className = `btn ${a.variant ?? ''}`;
      btn.textContent = a.label ?? 'Acción';
      btn.setAttribute('data-no-flip', 'true');
      if (a.onClick) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          a.onClick();
        });
      }
      bar.appendChild(btn);
    });
  }

  wrap.appendChild(bar);
  return wrap;
}
