/**
 * Header - Componente de cabecera vanilla JS
 * @module components/layout/Header
 */

import { createLink } from '../../router/router.js';

const navItems = [
  { path: '/', label: 'Inicio', icon: '🏠' },
  { path: '/fauna', label: 'Fauna', icon: '🦁' },
  { path: '/flora', label: 'Flora', icon: '🌿' }
];

/**
 * Renderiza el header como HTML string
 * @param {string} [currentPath='/'] - Ruta actual para marcar activo
 * @returns {string} HTML del header
 */
export function renderHeader(currentPath = '/') {
  const navLinksHTML = navItems.map(item => `
    <li class="nav-item">
      <a href="#${item.path}" class="nav-link ${currentPath === item.path ? 'active' : ''}">
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-label">${item.label}</span>
      </a>
    </li>
  `).join('');

  return `
    <header class="header">
      <div class="header-container">
        <a href="#/" class="header-logo">
          <div class="logo-icon">🌿</div>
          <div class="logo-text">
            <h1 class="logo-title">EcoAlbum</h1>
            <p class="logo-subtitle">Panamá</p>
          </div>
        </a>

        <nav class="header-nav desktop-nav">
          <ul class="nav-list">
            ${navLinksHTML}
          </ul>
        </nav>

        <button class="menu-toggle" aria-label="Abrir menú" aria-expanded="false">
          <span class="menu-toggle-line"></span>
          <span class="menu-toggle-line"></span>
          <span class="menu-toggle-line"></span>
        </button>

        <div class="mobile-menu">
          <nav class="header-nav mobile-nav">
            <ul class="nav-list">
              ${navLinksHTML}
            </ul>
          </nav>
          <div class="mobile-overlay"></div>
        </div>
      </div>
    </header>
  `;
}

/**
 * Monta el header y configura eventos
 * @param {HTMLElement} container - Contenedor donde montar
 * @param {string} [currentPath='/'] - Ruta actual
 */
export function mountHeader(container, currentPath = '/') {
  container.innerHTML = renderHeader(currentPath);
  
  const menuToggle = container.querySelector('.menu-toggle');
  const mobileMenu = container.querySelector('.mobile-menu');
  const overlay = container.querySelector('.mobile-overlay');
  const navLinks = container.querySelectorAll('.nav-link');
  
  let isMenuOpen = false;
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    mobileMenu.classList.toggle('open', isMenuOpen);
    menuToggle.setAttribute('aria-expanded', isMenuOpen);
    menuToggle.setAttribute('aria-label', isMenuOpen ? 'Cerrar menú' : 'Abrir menú');
    menuToggle.querySelectorAll('.menu-toggle-line').forEach(line => {
      line.classList.toggle('active', isMenuOpen);
    });
  }
  
  function closeMenu() {
    if (!isMenuOpen) return;
    isMenuOpen = false;
    mobileMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    menuToggle.querySelectorAll('.menu-toggle-line').forEach(line => {
      line.classList.remove('active');
    });
  }
  
  menuToggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/**
 * Actualiza el estado activo del header
 * @param {HTMLElement} container - Contenedor del header
 * @param {string} currentPath - Nueva ruta activa
 */
export function updateHeaderActive(container, currentPath) {
  const links = container.querySelectorAll('.nav-link');
  links.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === currentPath);
  });
}

export default { renderHeader, mountHeader, updateHeaderActive };