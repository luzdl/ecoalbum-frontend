/**
 * Button - Componente de botón vanilla JS
 * @module components/common/Button
 */

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger'
};

const SIZES = {
  small: 'btn-small',
  medium: 'btn-medium',
  large: 'btn-large'
};

/**
 * Crea un botón
 * @param {Object} options - Opciones
 * @param {string} [options.text=''] - Texto del botón
 * @param {Function} [options.onClick] - Callback al hacer click
 * @param {string} [options.type='button'] - Tipo de botón
 * @param {string} [options.variant='primary'] - Variante de estilo
 * @param {string} [options.size='medium'] - Tamaño
 * @param {boolean} [options.disabled=false] - Deshabilitado
 * @param {boolean} [options.loading=false] - En estado de carga
 * @param {boolean} [options.fullWidth=false] - Ancho completo
 * @param {string} [options.icon] - Ícono (emoji o texto)
 * @param {string} [options.iconPosition='left'] - Posición del ícono
 * @param {string} [options.className=''] - Clases adicionales
 * @returns {HTMLButtonElement} Elemento botón
 */
export function createButton({
  text = '',
  onClick = () => {},
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  className = ''
} = {}) {
  const button = document.createElement('button');
  button.type = type;
  
  const classes = [
    'btn',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.medium,
    fullWidth ? 'btn-full-width' : '',
    disabled ? 'btn-disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  button.className = classes;
  button.disabled = disabled || loading;
  button.setAttribute('aria-disabled', disabled || loading);
  
  function render() {
    let html = '';
    
    if (loading) {
      html = `
        <span class="btn-loader">
          <span class="btn-loader-dot"></span>
          <span class="btn-loader-dot"></span>
          <span class="btn-loader-dot"></span>
        </span>
      `;
    } else {
      const iconHTML = icon ? `<span class="btn-icon-text">${icon}</span>` : '';
      
      if (icon && iconPosition === 'left') {
        html = `${iconHTML}<span class="btn-content">${text}</span>`;
      } else if (icon && iconPosition === 'right') {
        html = `<span class="btn-content">${text}</span>${iconHTML}`;
      } else {
        html = `<span class="btn-content">${text}</span>`;
      }
    }
    
    button.innerHTML = html;
  }
  
  render();
  
  button.addEventListener('click', (e) => {
    if (!disabled && !loading) {
      onClick(e);
    }
  });
  
  // Métodos públicos
  button.setLoading = (isLoading) => {
    loading = isLoading;
    button.disabled = disabled || loading;
    render();
  };
  
  button.setDisabled = (isDisabled) => {
    disabled = isDisabled;
    button.disabled = disabled || loading;
    button.classList.toggle('btn-disabled', disabled);
  };
  
  button.setText = (newText) => {
    text = newText;
    render();
  };
  
  return button;
}

/**
 * Renderiza un botón como HTML string
 * @param {Object} options - Opciones del botón
 * @returns {string} HTML del botón
 */
export function renderButton({
  text = '',
  href = null,
  variant = 'primary',
  size = 'medium',
  className = '',
  icon = null,
  iconPosition = 'left'
} = {}) {
  const classes = [
    'btn',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.medium,
    className
  ].filter(Boolean).join(' ');
  
  const iconHTML = icon ? `<span class="btn-icon-text">${icon}</span>` : '';
  const content = iconPosition === 'left' 
    ? `${iconHTML}<span class="btn-content">${text}</span>`
    : `<span class="btn-content">${text}</span>${iconHTML}`;
  
  if (href) {
    return `<a href="${href}" class="${classes}">${content}</a>`;
  }
  
  return `<button type="button" class="${classes}">${content}</button>`;
}

export default { createButton, renderButton };