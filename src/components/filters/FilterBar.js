/**
 * @fileoverview Componente de filtros para fauna y flora
 * @module components/filters/FilterBar
 */

/**
 * Crea un input de búsqueda
 * @param {Function} onSearch - Callback cuando cambia la búsqueda
 * @returns {string} HTML del input de búsqueda
 */
function createSearchInput(onSearch) {
  return `
    <div class="filter-group filter-search">
      <input 
        type="text" 
        class="filter-input" 
        placeholder="Buscar especie..."
        id="search-input"
      />
    </div>
  `;
}

/**
 * Crea un selector de categorías
 * @param {Array} categories - Array de categorías disponibles
 * @param {Function} onFilter - Callback cuando cambia la categoría
 * @returns {string} HTML del selector
 */
function createCategoryFilter(categories = [], onFilter) {
  const options = categories
    .map(cat => `<option value="${cat.id_categoria}">${cat.nombre}</option>`)
    .join('');

  return `
    <div class="filter-group filter-category">
      <select class="filter-select" id="category-filter">
        <option value="">Todas las categorías</option>
        ${options}
      </select>
    </div>
  `;
}

/**
 * Crea un selector de estado de conservación
 * @param {Array} statuses - Estados disponibles
 * @param {Function} onFilter - Callback cuando cambia el estado
 * @returns {string} HTML del selector
 */
function createStatusFilter(statuses = [], onFilter) {
  const options = statuses
    .map(status => `<option value="${status}">${status}</option>`)
    .join('');

  return `
    <div class="filter-group filter-status">
      <select class="filter-select" id="status-filter">
        <option value="">Todos los estados</option>
        ${options}
      </select>
    </div>
  `;
}

/**
 * Crea filtro por letra inicial
 * @param {Function} onFilter - Callback cuando cambia la letra
 * @returns {string} HTML del filtro
 */
function createLetterFilter(onFilter) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const buttons = letters
    .map(letter => `
      <button class="filter-letter" data-letter="${letter.toLowerCase()}">
        ${letter}
      </button>
    `)
    .join('');

  return `
    <div class="filter-group filter-letters">
      <div class="filter-letters-container">
        ${buttons}
      </div>
    </div>
  `;
}

/**
 * Renderiza la barra de filtros
 * @param {Object} options - Opciones de configuración
 * @param {Array} [options.categories=[]] - Categorías disponibles
 * @param {Array} [options.statuses=[]] - Estados de conservación disponibles
 * @param {Function} [options.onFilter] - Callback cuando se aplica un filtro
 * @returns {HTMLElement} Elemento con la barra de filtros
 * @example
 * const categories = await getCategories();
 * const filterBar = renderFilterBar({ 
 *   categories, 
 *   onFilter: (filters) => console.log(filters) 
 * });
 * container.appendChild(filterBar);
 */
export function renderFilterBar({ categories = [], statuses = [], onFilter = () => {} } = {}) {
  const container = document.createElement('div');
  container.className = 'filter-bar';

  container.innerHTML = `
    <div class="filter-bar-content">
      ${createSearchInput(onFilter)}
      ${createCategoryFilter(categories, onFilter)}
      ${createStatusFilter(statuses, onFilter)}
      ${createLetterFilter(onFilter)}
      <button class="filter-reset" id="reset-filters">Limpiar filtros</button>
    </div>
  `;

  // Agregar event listeners
  const searchInput = container.querySelector('#search-input');
  const categorySelect = container.querySelector('#category-filter');
  const statusSelect = container.querySelector('#status-filter');
  const letterButtons = container.querySelectorAll('.filter-letter');
  const resetBtn = container.querySelector('#reset-filters');

  const collectFilters = () => {
    const filters = {
      q: searchInput?.value || '',
      categoria: categorySelect?.value || '',
      estado: statusSelect?.value || '',
      letra: '',
    };
    onFilter(filters);
  };

  searchInput?.addEventListener('input', collectFilters);
  categorySelect?.addEventListener('change', collectFilters);
  statusSelect?.addEventListener('change', collectFilters);

  letterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active state
      letterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filters = {
        q: searchInput?.value || '',
        categoria: categorySelect?.value || '',
        estado: statusSelect?.value || '',
        letra: btn.dataset.letter,
      };
      onFilter(filters);
    });
  });

  resetBtn?.addEventListener('click', () => {
    searchInput.value = '';
    categorySelect.value = '';
    statusSelect.value = '';
    letterButtons.forEach(b => b.classList.remove('active'));
    collectFilters();
  });

  return container;
}

export default { renderFilterBar };
