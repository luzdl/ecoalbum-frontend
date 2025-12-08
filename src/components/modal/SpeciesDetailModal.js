/**
 * SpeciesDetailModal - Modal para mostrar detalles de una especie vanilla JS
 * @module components/modal/SpeciesDetailModal
 */

import { createModal } from './Modal.js';

/**
 * Crea un modal de detalle de especie
 * @param {Object} species - Datos de la especie
 * @param {string} [species.commonName] - Nombre común
 * @param {string} [species.scientificName] - Nombre científico
 * @param {string} [species.image] - URL de la imagen
 * @param {string} [species.category] - Categoría
 * @param {string} [species.status] - Estado de conservación
 * @param {string} [species.description] - Descripción
 * @param {string} [species.sourceUrl] - URL de la fuente
 * @returns {Object} API del modal
 */
export function showSpeciesDetailModal(species = {}) {
  const {
    commonName = 'Nombre común no disponible',
    scientificName = '',
    image = '',
    category = '',
    status = '',
    description = '',
    sourceUrl = '',
  } = species || {};
  
  const modal = createModal({ 
    title: commonName || scientificName,
    className: 'species-modal'
  });
  
  const contentHTML = `
    <div class="species-grid">
      <img class="species-image" src="${image || '/placeholder-species.png'}" alt="${commonName || scientificName}">
      <div class="species-meta">
        ${scientificName ? `<div class="species-row" style="font-style: italic; color: #666;">${scientificName}</div>` : ''}
        <div class="species-row"><strong>Categoría:</strong>&nbsp;${category || '—'}</div>
        <div class="species-row"><strong>Estado:</strong>&nbsp;${status || '—'}</div>
        ${sourceUrl ? `<div class="species-row"><a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">Ver fuente</a></div>` : ''}
        <div class="species-description">${description || 'No hay descripción disponible.'}</div>
      </div>
    </div>
  `;
  
  modal.setContent(contentHTML);
  modal.open();
  
  return modal;
}

/**
 * Renderiza el contenido del modal como HTML string
 * @param {Object} species - Datos de la especie
 * @returns {string} HTML del contenido
 */
export function renderSpeciesDetailContent(species = {}) {
  const {
    commonName = 'Nombre común no disponible',
    scientificName = '',
    image = '',
    category = '',
    status = '',
    description = '',
    sourceUrl = '',
  } = species || {};
  
  return `
    <div class="species-grid">
      <img class="species-image" src="${image || '/placeholder-species.png'}" alt="${commonName || scientificName}">
      <div class="species-meta">
        ${scientificName ? `<div class="species-row" style="font-style: italic; color: #666;">${scientificName}</div>` : ''}
        <div class="species-row"><strong>Categoría:</strong>&nbsp;${category || '—'}</div>
        <div class="species-row"><strong>Estado:</strong>&nbsp;${status || '—'}</div>
        ${sourceUrl ? `<div class="species-row"><a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">Ver fuente</a></div>` : ''}
        <div class="species-description">${description || 'No hay descripción disponible.'}</div>
      </div>
    </div>
  `;
}

export default { showSpeciesDetailModal, renderSpeciesDetailContent };