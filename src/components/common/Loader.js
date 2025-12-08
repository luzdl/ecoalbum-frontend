/**
 * Loader - Componente de carga vanilla JS
 * @module components/common/Loader
 */

const SIZE_CLASSES = {
  small: 'loader-small',
  medium: 'loader-medium',
  large: 'loader-large'
};

const COLOR_CLASSES = {
  primary: 'loader-primary',
  secondary: 'loader-secondary',
  accent: 'loader-accent',
  white: 'loader-white'
};

/**
 * Crea un loader
 * @param {Object} options - Opciones
 * @param {string} [options.size='medium'] - Tamaño
 * @param {string} [options.color='primary'] - Color
 * @param {boolean} [options.fullScreen=false] - Pantalla completa
 * @param {string} [options.text='Cargando...'] - Texto
 * @returns {HTMLElement} Elemento loader
 */
export function createLoader({ size = 'medium', color = 'primary', fullScreen = false, text = 'Cargando...' } = {}) {
  const container = document.createElement('div');
  
  const loaderHTML = `
    <div class="loader ${SIZE_CLASSES[size] || SIZE_CLASSES.medium} ${COLOR_CLASSES[color] || COLOR_CLASSES.primary}">
      <div class="loader-spinner">
        <div class="loader-dot"></div>
        <div class="loader-dot"></div>
        <div class="loader-dot"></div>
        <div class="loader-dot"></div>
      </div>
      <p class="loader-text">${text}</p>
    </div>
  `;
  
  if (fullScreen) {
    container.className = 'loader-fullscreen';
    container.innerHTML = loaderHTML;
  } else {
    container.innerHTML = loaderHTML;
  }
  
  return container.firstElementChild || container;
}

/**
 * Renderiza un loader como HTML string
 * @param {Object} options - Opciones
 * @returns {string} HTML del loader
 */
export function renderLoader({ size = 'medium', color = 'primary', text = 'Cargando...' } = {}) {
  return `
    <div class="loader ${SIZE_CLASSES[size] || SIZE_CLASSES.medium} ${COLOR_CLASSES[color] || COLOR_CLASSES.primary}">
      <div class="loader-spinner">
        <div class="loader-dot"></div>
        <div class="loader-dot"></div>
        <div class="loader-dot"></div>
        <div class="loader-dot"></div>
      </div>
      <p class="loader-text">${text}</p>
    </div>
  `;
}

/**
 * Renderiza un loader en pantalla completa
 * @param {Object} options - Opciones
 * @returns {string} HTML del loader
 */
export function renderFullScreenLoader(options = {}) {
  return `<div class="loader-fullscreen">${renderLoader(options)}</div>`;
}

export default { createLoader, renderLoader, renderFullScreenLoader };