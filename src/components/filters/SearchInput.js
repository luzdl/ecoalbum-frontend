/**
 * SearchInput - Input de búsqueda vanilla JS con debounce
 * @module components/filters/SearchInput
 */

/**
 * Crea un input de búsqueda con debounce
 * @param {Object} options - Opciones
 * @param {string} [options.value=''] - Valor inicial
 * @param {Function} [options.onChange] - Callback cuando cambia el valor
 * @param {string} [options.placeholder='Buscar...'] - Placeholder
 * @param {number} [options.debounceMs=300] - Tiempo de debounce
 * @returns {HTMLElement} Input element
 */
export function createSearchInput({ value = '', onChange = () => {}, placeholder = 'Buscar...', debounceMs = 300 } = {}) {
  const input = document.createElement('input');
  input.type = 'search';
  input.value = value;
  input.placeholder = placeholder;
  input.setAttribute('aria-label', 'Buscar');
  input.className = 'search-input';
  input.style.cssText = 'padding: 6px 8px; min-width: 160px;';
  
  let timeoutId = null;
  
  input.addEventListener('input', (e) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      onChange(e.target.value);
    }, debounceMs);
  });
  
  // Método para actualizar valor externamente
  input.setValue = (newValue) => {
    input.value = newValue;
  };
  
  return input;
}

export default { createSearchInput };