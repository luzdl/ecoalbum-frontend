/**
 * @fileoverview Página de detalle de una planta
 * @module pages/flora/FloraDetailPage
 */

import { createLink } from '../../router/router.js';
import { getPlantaCompleta } from '../../services/floraService.js';
import '../../components/gallery/Gallery.css';

/**
 * Renderiza la página de detalle de flora
 * @param {HTMLElement} container - Contenedor de la página
 * @param {Object} params - Parámetros de la ruta
 * @param {string} params.id - ID de la planta
 */
export function render(container, params) {
  const { id } = params;
  // Determinar link de volver: si se vino desde home (hash contiene from=home) volver a '/'
  const hash = window.location.hash || '';
  const backHref = hash.includes('from=home') ? '/' : '/flora';
  
  container.innerHTML = `
    <div class="flora-detail-page">
      <div class="detail-modal">
        <div class="detail-header">
          <nav class="breadcrumb">${createLink('/', 'Inicio')} / ${createLink('/flora', 'Flora')} / Detalle</nav>
          <div class="controls">
            <button class="detail-prev btn btn-outline">← Anterior</button>
            <button class="detail-next btn btn-outline">Siguiente →</button>
            ${createLink(backHref, backHref === '/' ? '← Volver al inicio' : '← Volver a Flora', 'btn btn-primary')}
          </div>
        </div>
        <div class="detail-content">
          <div id="flora-detail-root"><div class="gallery-loading">Cargando información…</div></div>
        </div>
      </div>
    </div>
  `;

  (async () => {
    const root = container.querySelector('#flora-detail-root');
    async function load() {
      root.innerHTML = '<div class="gallery-loading">Cargando información…</div>';
      try {
        const { planta, fotos } = await getPlantaCompleta(id);

        // prepare images
        const images = [];
        if (planta?.foto_principal) images.push(planta.foto_principal.url_foto || planta.foto_principal);
        if (Array.isArray(fotos)) fotos.forEach(f => images.push(f.url_foto || f.url || f.foto || ''));
        if (images.length === 0) images.push('/placeholder-species.png');

        const wrap = document.createElement('div');
        wrap.className = 'flora-detail-wrap';

        const imgsHTML = `
          <div class="species-images">
            ${images.map(img => `<img class="species-image" src="${img}" onerror="this.onerror=null;this.src='/placeholder-species.png'"/>`).join('')}
          </div>`;

        const info = document.createElement('div');
        info.className = 'species-meta';
        info.innerHTML = `
          <div style="font-style:italic;color:#666;">${planta?.nombre_cientifico || ''}</div>
          <h2>${planta?.nombre_comun || 'Sin nombre'}</h2>
          <div class="species-row"><strong>Estado:</strong> ${planta?.estado_display || planta?.estado || '—'}</div>
          <div class="species-description">${planta?.distribucion || planta?.descripcion || 'Sin descripción.'}</div>
        `;

        wrap.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'species-grid';
        grid.innerHTML = imgsHTML;
        grid.appendChild(info);

        wrap.appendChild(grid);

        root.innerHTML = '';
        root.appendChild(wrap);
      } catch (err) {
        console.error('FloraDetailPage load error', err);
        root.innerHTML = '';
        const errDiv = document.createElement('div');
        errDiv.className = 'error';
        errDiv.textContent = `Error cargando detalle: ${err.message || err}`;
        const retry = document.createElement('button');
        retry.className = 'btn-retry';
        retry.textContent = 'Reintentar';
        retry.addEventListener('click', load);
        root.appendChild(errDiv);
        root.appendChild(retry);
      }
    }

    load();

    // entry animation
    const modal = document.querySelector('.detail-modal');
    if (modal) { modal.classList.add('stack-enter'); modal.addEventListener('animationend', () => modal.classList.remove('stack-enter'), { once: true }); }

    // Prev/Next
    const prevBtn = document.querySelector('.detail-prev');
    const nextBtn = document.querySelector('.detail-next');
    const parsedId = Number(id);
    const canUseNumeric = Number.isFinite(parsedId);
    if (!canUseNumeric) { if (prevBtn) prevBtn.style.display = 'none'; if (nextBtn) nextBtn.style.display = 'none'; }
    else {
      if (prevBtn) prevBtn.addEventListener('click', (e) => {
        e.preventDefault(); const targetId = String(parsedId - 1); if (!targetId) return; if (modal) { modal.classList.add('stack-exit-prev'); modal.addEventListener('animationend', () => { window.location.hash = `#/flora/${targetId}`; }, { once: true }); } else { window.location.hash = `#/flora/${targetId}`; }
      });
      if (nextBtn) nextBtn.addEventListener('click', (e) => {
        e.preventDefault(); const targetId = String(parsedId + 1); if (!targetId) return; if (modal) { modal.classList.add('stack-exit-next'); modal.addEventListener('animationend', () => { window.location.hash = `#/flora/${targetId}`; }, { once: true }); } else { window.location.hash = `#/flora/${targetId}`; }
      });
    }
  })();
}

export default { render };
