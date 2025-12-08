/**
 * StatusFilter - Select de estado de conservación vanilla JS
 * @module components/filters/StatusFilter
 */

/**
 * Crea un select de estados
 * @param {Object} options - Opciones
 * @param {Array} [options.options=[]] - Array de opciones
 * @param {string} [options.value=''] - Valor seleccionado
 * @param {Function} [options.onChange] - Callback cuando cambia
 * @param {string} [options.placeholder='Estado'] - Placeholder
 * @returns {HTMLElement} Select element
 */
export function createStatusFilter({ options = [], value = '', onChange = () => {}, placeholder = 'Estado' } = {}) {
  const select = document.createElement('select');
  select.setAttribute('aria-label', 'Filtrar por estado');
  select.className = 'filter-select status-filter';
  select.style.cssText = 'padding: 6px 8px;';
  
  function renderOptions() {
    select.innerHTML = `<option value="">${placeholder}</option>`;
    options.forEach(opt => {
      const key = typeof opt === 'string' ? opt : opt.id ?? opt.value;
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

export default { createStatusFilter };