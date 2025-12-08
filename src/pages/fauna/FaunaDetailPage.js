/**
 * @fileoverview Página de detalle de un animal
 * @module pages/fauna/FaunaDetailPage
 */

import { createLink, getParams } from '../../router/router.js';

/**
 * Renderiza la página de detalle de fauna
 * @param {HTMLElement} container - Contenedor de la página
 * @param {Object} params - Parámetros de la ruta
 * @param {string} params.id - ID del animal
 */
export function render(container, params) {
  const { id } = params;
  
  container.innerHTML = `
    <div class="fauna-detail-page">
      <header class="page-header">
        <nav class="breadcrumb">
          ${createLink('/', 'Inicio')} / 
          ${createLink('/fauna', 'Fauna')} / 
          <span>Detalle</span>
        </nav>
        <h1>🦁 Detalle del Animal #${id}</h1>
      </header>
      
      <section class="detail-content">
        <!-- SpeciesDetailModal content will be adapted here -->
        <div class="detail-placeholder">
          <p>Información completa del animal (por implementar)</p>
          <ul>
            <li>Carrusel de fotos</li>
            <li>Nombre común y científico</li>
            <li>Descripción</li>
            <li>Hábitat</li>
            <li>Distribución</li>
            <li>Importancia ecológica</li>
            <li>Estado de conservación</li>
            <li>Categoría</li>
            <li>Amenazas</li>
            <li>Acciones de protección</li>
          </ul>
        </div>
      </section>
      
      <nav class="detail-nav">
        ${createLink('/fauna', '← Volver a Fauna', 'btn')}
      </nav>
    </div>
  `;
}

export default { render };
