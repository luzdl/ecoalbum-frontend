/**
 * CategoryFilter - Select de categorías vanilla JS
 * @module components/filters/CategoryFilter
 */

/**
 * Crea un select de categorías
 * @param {Object} options - Opciones
 * @param {Array} [options.options=[]] - Array de opciones (string o {id, name})
 * @param {string} [options.value=''] - Valor seleccionado
 * @param {Function} [options.onChange] - Callback cuando cambia
 * @param {string} [options.placeholder='Categoría'] - Placeholder
 * @returns {HTMLElement} Select element
 */
export function createCategoryFilter({ options = [], value = '', onChange = () => {}, placeholder = 'Categoría' } = {}) {
  const select = document.createElement('select');
  select.setAttribute('aria-label', 'Filtrar por categoría');
  select.className = 'filter-select category-filter';
  select.style.cssText = 'padding: 6px 8px;';
  
  // Renderizar opciones
  function renderOptions() {
    select.innerHTML = `<option value="">${placeholder}</option>`;
    options.forEach(opt => {
      const key = typeof opt === 'string' ? opt : opt.id ?? opt.name;
      const label = typeof opt === 'string' ? opt : opt.name ?? opt.label ?? key;
      const option = document.createElement('option');
      option.value = key;
      option.textContent = label;
      if (key === value) option.selected = true;
      select.appendChild(option);
    });
  }
  
  renderOptions();
  
  select.addEventListener('change', (e) => {
    onChange(e.target.value);
  });
  
  // Métodos para actualizar
  select.setOptions = (newOptions) => {
    options = newOptions;
    renderOptions();
  };
  
  select.setValue = (newValue) => {
    value = newValue;
    select.value = newValue;
  };
  
  return select;
}

export default { createCategoryFilter };