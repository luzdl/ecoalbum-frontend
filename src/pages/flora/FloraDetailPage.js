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
  
  container.innerHTML = `
    <div class="flora-detail-page">
      <header class="page-header">
        <nav class="breadcrumb">
          ${createLink('/', 'Inicio')} / 
          ${createLink('/flora', 'Flora')} / 
          <span>Detalle</span>
        </nav>
        <h1>🌺 Detalle de la Planta #${id}</h1>
      </header>
      
      <section class="detail-content">
        <div id="flora-detail-root">
          <div class="gallery-loading">Cargando información…</div>
        </div>
      </section>
      
      <nav class="detail-nav">
        ${createLink('/flora', '← Volver a Flora', 'btn')}
      </nav>
    </div>
  `;

  (async () => {
    const root = container.querySelector('#flora-detail-root');
    async function load() {
      root.innerHTML = '<div class="gallery-loading">Cargando información…</div>';
      try {
        const { planta, fotos } = await getPlantaCompleta(id);

        const wrap = document.createElement('div');
        wrap.className = 'flora-detail-wrap';

        // Fotos (simple grid/carrusel placeholder)
        const fotosDiv = document.createElement('div');
        fotosDiv.className = 'flora-photos';
        if (Array.isArray(fotos) && fotos.length) {
          fotos.forEach((f) => {
            const img = document.createElement('img');
            img.src = f.url_foto || f.url || '';
            img.alt = f.descripcion || (planta && (planta.nombre_comun || planta.nombre_cientifico)) || 'Foto de planta';
            img.className = 'flora-photo';
            fotosDiv.appendChild(img);
          });
        } else {
          fotosDiv.innerHTML = '<div class="gallery-empty">No hay fotos disponibles</div>';
        }

        const info = document.createElement('div');
        info.className = 'flora-info';
        info.innerHTML = `
          <h2>${(planta && (planta.nombre_comun || 'Sin nombre'))}</h2>
          <h3><em>${(planta && planta.nombre_cientifico) || ''}</em></h3>
          <p class="flora-desc">${(planta && planta.descripcion) || 'Sin descripción.'}</p>
          <p><strong>Distribución:</strong> ${(planta && planta.distribucion) || '—'}</p>
          <p><strong>Estado:</strong> ${(planta && (planta.estado_display || planta.estado)) || '—'}</p>
        `;

        wrap.appendChild(fotosDiv);
        wrap.appendChild(info);

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
  })();
}

export default { render };
