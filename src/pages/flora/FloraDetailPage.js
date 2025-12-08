/**
 * @fileoverview Página de detalle de una planta
 * @module pages/flora/FloraDetailPage
 */

import { createLink } from '../../router/router.js';

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
        <!-- SpeciesDetailModal content will be adapted here -->
        <div class="detail-placeholder">
          <p>Información completa de la planta (por implementar)</p>
          <ul>
            <li>Carrusel de fotos</li>
            <li>Nombre común y científico</li>
            <li>Descripción</li>
            <li>Distribución</li>
            <li>Estado de conservación</li>
          </ul>
        </div>
      </section>
      
      <nav class="detail-nav">
        ${createLink('/flora', '← Volver a Flora', 'btn')}
      </nav>
    </div>
  `;
}

export default { render };
