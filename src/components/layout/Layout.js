/**
 * Layout - Componente de layout principal vanilla JS
 * @module components/layout/Layout
 */

import { renderHeader, mountHeader, updateHeaderActive } from './Header.js';
import { renderFooter, mountFooter } from './Footer.js';

/**
 * Renderiza el layout completo como HTML string
 * @param {string} [currentPath='/'] - Ruta actual
 * @returns {string} HTML del layout
 */
export function renderLayout(currentPath = '/') {
  return `
    <div class="layout">
      <div id="header-container">${renderHeader(currentPath)}</div>
      <main class="layout-main" id="main-content"></main>
      <div id="footer-container">${renderFooter()}</div>
    </div>
  `;
}

/**
 * Monta el layout y configura eventos
 * @param {HTMLElement} container - Contenedor raíz (#app)
 * @param {string} [currentPath='/'] - Ruta actual
 * @returns {Object} API del layout
 */
export function mountLayout(container, currentPath = '/') {
  container.innerHTML = renderLayout(currentPath);
  
  const headerContainer = container.querySelector('#header-container');
  const mainContent = container.querySelector('#main-content');
  
  // Configurar eventos del header
  const menuToggle = headerContainer.querySelector('.menu-toggle');
  const mobileMenu = headerContainer.querySelector('.mobile-menu');
  const overlay = headerContainer.querySelector('.mobile-overlay');
  const navLinks = headerContainer.querySelectorAll('.nav-link');
  
  let isMenuOpen = false;
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    mobileMenu.classList.toggle('open', isMenuOpen);
    menuToggle.setAttribute('aria-expanded', isMenuOpen);
  }
  
  function closeMenu() {
    if (!isMenuOpen) return;
    isMenuOpen = false;
    mobileMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  
  menuToggle?.addEventListener('click', toggleMenu);
  overlay?.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  
  return {
    mainContent,
    updateActive: (path) => updateHeaderActive(headerContainer, path),
    closeMenu
  };
}

/**
 * Obtiene el contenedor principal del layout existente
 * @returns {HTMLElement|null} Contenedor #main-content
 */
export function getMainContent() {
  return document.querySelector('#main-content');
}

export default { renderLayout, mountLayout, getMainContent };