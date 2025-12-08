/**
 * Modal - Componente modal vanilla JS
 * @module components/modal/Modal
 */

import './Modal.css';

/**
 * Crea y gestiona un modal
 * @param {Object} options - Opciones
 * @param {string} [options.title=''] - Título del modal
 * @param {string} [options.className=''] - Clases adicionales
 * @returns {Object} API del modal
 */
export function createModal({ title = '', className = '' } = {}) {
  let isOpen = false;
  let onCloseCallback = () => {};
  
  // Crear estructura del modal
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', title || 'Modal');
  
  overlay.innerHTML = `
    <div class="modal-content ${className}">
      <header class="modal-header">
        <h2 class="modal-title">${title}</h2>
        <button class="modal-close" aria-label="Cerrar" type="button">✕</button>
      </header>
      <div class="modal-body"></div>
    </div>
  `;
  
  const content = overlay.querySelector('.modal-content');
  const titleEl = overlay.querySelector('.modal-title');
  const bodyEl = overlay.querySelector('.modal-body');
  const closeBtn = overlay.querySelector('.modal-close');
  
  // Event handlers
  function handleKeydown(e) {
    if (e.key === 'Escape') close();
  }
  
  function handleOverlayClick(e) {
    if (e.target === overlay) close();
  }
  
  // Métodos públicos
  function open() {
    if (isOpen) return;
    isOpen = true;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeydown);
    // Focus trap - enfocar el primer elemento focusable
    setTimeout(() => closeBtn.focus(), 10);
  }
  
  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeydown);
    onCloseCallback();
  }
  
  function setTitle(newTitle) {
    titleEl.textContent = newTitle;
    overlay.setAttribute('aria-label', newTitle || 'Modal');
  }
  
  function setContent(content) {
    if (typeof content === 'string') {
      bodyEl.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      bodyEl.innerHTML = '';
      bodyEl.appendChild(content);
    }
  }
  
  function onClose(callback) {
    onCloseCallback = callback;
  }
  
  function destroy() {
    close();
    overlay.remove();
  }
  
  // Event listeners
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', handleOverlayClick);
  
  // Añadir al body
  document.body.appendChild(overlay);
  
  return {
    element: overlay,
    open,
    close,
    setTitle,
    setContent,
    onClose,
    destroy,
    isOpen: () => isOpen
  };
}

/**
 * Muestra un modal rápido con contenido
 * @param {Object} options - Opciones
 * @param {string} options.title - Título
 * @param {string|HTMLElement} options.content - Contenido
 * @param {Function} [options.onClose] - Callback al cerrar
 * @returns {Object} API del modal
 */
export function showModal({ title, content, onClose = () => {} }) {
  const modal = createModal({ title });
  modal.setContent(content);
  modal.onClose(onClose);
  modal.open();
  return modal;
}

export default { createModal, showModal };