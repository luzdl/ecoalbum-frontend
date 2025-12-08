/**
 * LetterFilter - Filtro alfabético vanilla JS
 * @module components/filters/LetterFilter
 */

const DEFAULT_LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

/**
 * Crea un filtro alfabético
 * @param {Object} options - Opciones
 * @param {Array} [options.letters] - Array de letras
 * @param {string} [options.value=''] - Letra seleccionada
 * @param {Function} [options.onChange] - Callback cuando cambia
 * @returns {HTMLElement} Container con botones
 */
export function createLetterFilter({ letters = DEFAULT_LETTERS, value = '', onChange = () => {} } = {}) {
  const container = document.createElement('div');
  container.setAttribute('role', 'tablist');
  container.setAttribute('aria-label', 'Filtrar por letra');
  container.className = 'letter-filter';
  container.style.cssText = 'display: flex; gap: 6px; align-items: center; flex-wrap: wrap;';
  
  let currentValue = value;
  
  function render() {
    container.innerHTML = '';
    
    // Botón "Todas"
    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.textContent = 'Todas';
    allBtn.className = 'letter-btn' + (currentValue === '' ? ' active' : '');
    allBtn.style.cssText = `padding: 4px 6px; opacity: ${currentValue === '' ? 1 : 0.7};`;
    allBtn.setAttribute('aria-pressed', currentValue === '');
    allBtn.addEventListener('click', () => {
      currentValue = '';
      onChange('');
      render();
    });
    container.appendChild(allBtn);
    
    // Botones de letras
    letters.forEach(l => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = l;
      btn.className = 'letter-btn' + (currentValue === l ? ' active' : '');
      btn.style.cssText = `padding: 4px 6px; background: ${currentValue === l ? '#ddd' : 'transparent'};`;
      btn.setAttribute('aria-pressed', currentValue === l);
      btn.addEventListener('click', () => {
        currentValue = l;
        onChange(l);
        render();
      });
      container.appendChild(btn);
    });
  }
  
  render();
  
  container.setValue = (newValue) => {
    currentValue = newValue;
    render();
  };
  
  return container;
}

export default { createLetterFilter };