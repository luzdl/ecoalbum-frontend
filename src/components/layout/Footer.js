/**
 * Footer - Componente de pie de página vanilla JS
 * @module components/layout/Footer
 */

const quickLinks = [
  { path: '/', label: 'Inicio' },
  { path: '/fauna', label: 'Fauna' },
  { path: '/flora', label: 'Flora' }
];

const contactInfo = {
  email: 'sinia@miambiente.gob.pa',
  phone: '+507 500 - 0855',
  address: 'Calle Diego Domínguez, Edif. 804 Albrook, Ancón, Panamá, Rep. de Panamá'
};

/**
 * Renderiza el footer como HTML string
 * @returns {string} HTML del footer
 */
export function renderFooter() {
  const currentYear = new Date().getFullYear();
  
  const quickLinksHTML = quickLinks.map(link => `
    <li class="footer-link-item">
      <a href="#${link.path}" class="footer-link">${link.label}</a>
    </li>
  `).join('');

  return `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <div class="footer-logo-icon">🌿</div>
            <div class="footer-logo-text">
              <h3 class="footer-title">EcoAlbum Panamá</h3>
              <p class="footer-tagline">Conservando nuestra biodiversidad</p>
            </div>
          </div>
          <p class="footer-description">
            Plataforma educativa para conocer y proteger la fauna y flora 
            en peligro de extinción de Panamá.
          </p>
        </div>

        <div class="footer-section">
          <h4 class="footer-section-title">Enlaces Rápidos</h4>
          <ul class="footer-links">
            ${quickLinksHTML}
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="footer-section-title">Contacto</h4>
          <ul class="footer-contact">
            <li class="contact-item">
              <span class="contact-icon">📧</span>
              <a href="mailto:${contactInfo.email}" class="contact-link">
                ${contactInfo.email}
              </a>
            </li>
            <li class="contact-item">
              <span class="contact-icon">📞</span>
              <a href="tel:${contactInfo.phone}" class="contact-link">
                ${contactInfo.phone}
              </a>
            </li>
            <li class="contact-item">
              <span class="contact-icon">📍</span>
              <span class="contact-text">${contactInfo.address}</span>
            </li>
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="footer-section-title">Proyecto Educativo</h4>
          <p class="footer-educational">
            Esta plataforma es un recurso educativo para promover la 
            conservación de especies en peligro de extinción en Panamá.
          </p>
          <div class="footer-badges">
            <span class="badge badge-conservation">🌱 Conservación</span>
            <span class="badge badge-education">📚 Educación</span>
            <span class="badge badge-panama">🇵🇦 Panamá</span>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="footer-copyright">
            &copy; ${currentYear} EcoAlbum Panamá. Todos los derechos reservados.
          </p>
          <div class="footer-legal">
            <a href="#/privacidad" class="footer-legal-link">
              Política de Privacidad
            </a>
            <span class="footer-legal-separator">•</span>
            <a href="#/terminos" class="footer-legal-link">
              Términos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

/**
 * Monta el footer en un contenedor
 * @param {HTMLElement} container - Contenedor donde montar
 */
export function mountFooter(container) {
  container.innerHTML = renderFooter();
}

export default { renderFooter, mountFooter };