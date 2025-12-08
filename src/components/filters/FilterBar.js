/**
 * FilterBar - Barra de filtros completa vanilla JS
 * @module components/filters/FilterBar
 */

import { createSearchInput } from './SearchInput.js';
import { createCategoryFilter } from './CategoryFilter.js';
import { createStatusFilter } from './StatusFilter.js';
import { createLetterFilter } from './LetterFilter.js';

/**
 * Crea una barra de filtros completa
 * @param {Object} options - Opciones
 * @param {Function} [options.onChange] - Callback cuando cambian los filtros
 * @param {Object} [options.initialFilters] - Filtros iniciales
 * @param {Array} [options.categories] - Opciones de categorías
 * @param {Array} [options.statuses] - Opciones de estados
 * @param {Array} [options.letters] - Letras disponibles
 * @returns {HTMLElement} Barra de filtros
 */
export function createFilterBar({ 
  onChange = () => {}, 
  initialFilters = {},
  categories = [],
  statuses = [],
  letters = null
} = {}) {
  const container = document.createElement('div');
  container.className = 'filter-bar';
  container.style.cssText = 'display: flex; gap: 8px; align-items: center; flex-wrap: wrap;';
  
  // Estado de los filtros
  const filters = {
    query: initialFilters.query || '',
    category: initialFilters.category || '',
    status: initialFilters.status || '',
    letter: initialFilters.letter || ''
  };
  
  // Función para notificar cambios
  const notifyChange = () => {
    onChange({ ...filters });
  };
  
  // Crear componentes
  const searchInput = createSearchInput({
    value: filters.query,
    placeholder: 'Buscar...',
    onChange: (value) => {
      filters.query = value;
      notifyChange();
    }
  });
  
  const categorySelect = createCategoryFilter({
    options: categories,
    value: filters.category,
    placeholder: 'Categoría',
    onChange: (value) => {
      filters.category = value;
      notifyChange();
    }
  });
  
  const statusSelect = createStatusFilter({
    options: statuses,
    value: filters.status,
    placeholder: 'Estado',
    onChange: (value) => {
      filters.status = value;
      notifyChange();
    }
  });
  
  const letterFilter = createLetterFilter({
    letters: letters,
    value: filters.letter,
    onChange: (value) => {
      filters.letter = value;
      notifyChange();
    }
  });
  
  // Añadir al container
  container.appendChild(searchInput);
  container.appendChild(categorySelect);
  container.appendChild(statusSelect);
  container.appendChild(letterFilter);
  
  // Métodos públicos
  container.setCategories = (newCategories) => {
    categorySelect.setOptions(newCategories);
  };
  
  container.setStatuses = (newStatuses) => {
    statusSelect.setOptions(newStatuses);
  };
  
  container.getFilters = () => ({ ...filters });
  
  container.reset = () => {
    filters.query = '';
    filters.category = '';
    filters.status = '';
    filters.letter = '';
    searchInput.setValue('');
    categorySelect.setValue('');
    statusSelect.setValue('');
    letterFilter.setValue('');
    notifyChange();
  };
  
  return container;
}

export default { createFilterBar };
