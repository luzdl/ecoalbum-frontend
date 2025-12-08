/**
 * GalleryItem - Componente vanilla JS para un item de galería
 * @module components/gallery/GalleryItem
 */

/**
 * Crea un elemento de galería
 * @param {Object} item - Datos del item
 * @param {string} item.id - ID del item
 * @param {string} item.commonName - Nombre común
 * @param {string} item.image - URL de la imagen
 * @param {string} [item.category] - Categoría
 * @param {string} [item.status] - Estado de conservación
 * @param {Function} [onClick] - Callback cuando se hace click
 * @returns {HTMLElement} Elemento DOM del item
 */
export function createGalleryItem(item = {}, onClick = () => {}) {
  const { id, commonName, image, category, status } = item;
  
  const wrapper = document.createElement('div');
  wrapper.className = 'gallery-item';
  wrapper.setAttribute('role', 'button');
  wrapper.setAttribute('tabindex', '0');
  wrapper.setAttribute('aria-label', commonName || 'Especie');
  
  wrapper.innerHTML = `
    <div class="gallery-item-image">
      <img src="${image || '/placeholder-species.png'}" alt="${commonName || 'Especie'}" loading="lazy">
      <div class="gallery-item-overlay">
        <button class="gallery-item-btn" aria-label="Ver detalles de ${commonName || 'especie'}">
          Ver detalles
        </button>
      </div>
    </div>
    <div class="gallery-item-info">
      <h3 class="gallery-item-name">${commonName || 'Sin nombre'}</h3>
      <p class="gallery-item-meta">
        <span class="gallery-item-category">${category || '—'}</span>
        ${status ? `<span class="gallery-item-status">${status}</span>` : ''}
      </p>
    </div>
  `;
  
  // Event listeners
  wrapper.addEventListener('click', () => onClick(item));
  wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(item);
    }
  });
  
  return wrapper;
}

/**
 * Renderiza un item de galería como string HTML
 * @param {Object} item - Datos del item
 * @returns {string} HTML string
 */
export function renderGalleryItemHTML(item = {}) {
  const { id, commonName, image, category, status, url } = item;
  
  return `
    <a href="${url || '#'}" class="gallery-item" aria-label="${commonName || 'Especie'}">
      <div class="gallery-item-image">
        <img src="${image || '/placeholder-species.png'}" alt="${commonName || 'Especie'}" loading="lazy">
        <div class="gallery-item-overlay">
          <span class="gallery-item-btn">Ver detalles</span>
        </div>
      </div>
      <div class="gallery-item-info">
        <h3 class="gallery-item-name">${commonName || 'Sin nombre'}</h3>
        <p class="gallery-item-meta">
          <span class="gallery-item-category">${category || '—'}</span>
          ${status ? `<span class="gallery-item-status">${status}</span>` : ''}
        </p>
      </div>
    </a>
  `;
}

export default { createGalleryItem, renderGalleryItemHTML };