/**
 * Componente base FlipCard (vanilla JS + accesible)
 * Uso:
 *   import { createFlipCard } from "./FlipCard.js";
 *   const el = createFlipCard({ front: HTMLElement, back: HTMLElement, size: 'md', glass: true });
 *   grid.appendChild(el);
 */

export function createFlipCard({ front, back, size = 'md', glass = false, title = '' } = {}) {
  const root = document.createElement('article');
  root.className = `flip-card flip-${size}${glass ? ' glass' : ''}`;
  root.setAttribute('tabindex', '0'); // focusable para teclado
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
  if (back instanceof HTMLElement)  backSlot.appendChild(back);

  // Interacción accesible: click/tap/Enter/Espacio para alternar
  const toggle = () => root.classList.toggle('is-flipped');

  // Click en cualquier zona “accionable”
  root.addEventListener('click', (e) => {
    // Si el click vino de un elemento con data-no-flip, no voltear
    const noFlip = e.target.closest('[data-no-flip="true"]');
    if (noFlip) return;
    toggle();
  });

  // Teclado
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
    if (e.key === 'Escape') {
      root.classList.remove('is-flipped');
    }
  });

  // Evitar seleccionar texto al arrastrar
  root.addEventListener('dragstart', (e) => e.preventDefault());

  return root;
}

/**
 * Helpers para construir lados rápidamente
 */
export function buildFront({ image, title, subtitle, statusBadge }) {
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
    <div class="flip-meta">
      ${statusBadge ?? ''}
      <button class="btn btn-outline btn-sm flip-toggle" data-no-flip="true" type="button" aria-label="Ver reverso">Ver más</button>
    </div>
  `;
  wrap.appendChild(body);
  return wrap;
}

export function buildBack({ paragraphs = [], habitat, region, actions = [] }) {
  const wrap = document.createElement('div');
  wrap.className = 'flip-body';
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

  if (actions.length) {
    const bar = document.createElement('div');
    bar.className = 'flip-actions';
    actions.forEach(a => {
      const btn = document.createElement('a');
      btn.href = a.href ?? '#';
      btn.className = `btn ${a.variant ?? ''}`;
      btn.textContent = a.label ?? 'Acción';
      btn.setAttribute('data-no-flip', 'true');
      bar.appendChild(btn);
    });
    wrap.appendChild(bar);
  }
  return wrap;
}
