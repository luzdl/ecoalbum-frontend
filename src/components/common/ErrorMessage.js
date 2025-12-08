/**
 * ErrorMessage - Componente de mensaje de error vanilla JS
 * @module components/common/ErrorMessage
 */

const VARIANTS = {
  default: 'error-default',
  warning: 'error-warning',
  danger: 'error-danger',
  info: 'error-info'
};

const ERROR_ICON_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
`;

/**
 * Crea un mensaje de error
 * @param {Object} options - Opciones
 * @param {string} [options.message='Ha ocurrido un error'] - Mensaje
 * @param {string} [options.details=null] - Detalles adicionales
 * @param {Function} [options.onRetry=null] - Callback para reintentar
 * @param {string} [options.variant='default'] - Variante de estilo
 * @param {boolean} [options.showIcon=true] - Mostrar ícono
 * @returns {HTMLElement} Elemento del mensaje
 */
export function createErrorMessage({ 
  message = 'Ha ocurrido un error', 
  details = null, 
  onRetry = null,
  variant = 'default',
  showIcon = true
} = {}) {
  const container = document.createElement('div');
  container.className = `error-message ${VARIANTS[variant] || VARIANTS.default}`;
  
  container.innerHTML = `
    ${showIcon ? `<div class="error-icon">${ERROR_ICON_SVG}</div>` : ''}
    <div class="error-content">
      <h3 class="error-title">Error</h3>
      <p class="error-message-text">${message}</p>
      ${details ? `
        <details class="error-details">
          <summary class="error-details-summary">Más información</summary>
          <pre class="error-details-content">${details}</pre>
        </details>
      ` : ''}
    </div>
    ${onRetry ? `<button class="error-retry-button" aria-label="Reintentar">Reintentar</button>` : ''}
  `;
  
  if (onRetry) {
    const retryBtn = container.querySelector('.error-retry-button');
    retryBtn.addEventListener('click', onRetry);
  }
  
  return container;
}

/**
 * Renderiza un mensaje de error como HTML string
 * @param {Object} options - Opciones
 * @returns {string} HTML del mensaje
 */
export function renderErrorMessage({ 
  message = 'Ha ocurrido un error', 
  details = null, 
  variant = 'default',
  showIcon = true,
  showRetry = false
} = {}) {
  return `
    <div class="error-message ${VARIANTS[variant] || VARIANTS.default}">
      ${showIcon ? `<div class="error-icon">${ERROR_ICON_SVG}</div>` : ''}
      <div class="error-content">
        <h3 class="error-title">Error</h3>
        <p class="error-message-text">${message}</p>
        ${details ? `
          <details class="error-details">
            <summary class="error-details-summary">Más información</summary>
            <pre class="error-details-content">${details}</pre>
          </details>
        ` : ''}
      </div>
      ${showRetry ? `<button class="error-retry-button" onclick="location.reload()" aria-label="Reintentar">Reintentar</button>` : ''}
    </div>
  `;
}

export default { createErrorMessage, renderErrorMessage };