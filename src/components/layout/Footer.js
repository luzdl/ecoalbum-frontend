import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/fauna', label: 'Fauna' },
    { path: '/flora', label: 'Flora' }
  ];

  const contactInfo = {
    email: 'sinia@miambiente.gob.pa',
    phone: '+507 500 - 0855',
    address: 'Calle Diego Domínguez, Edif. 804 Albrook, Ancón, Panamá, Rep. de  Panamá'
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <div className="footer-logo-icon"></div>
            <div className="footer-logo-text">
              <h3 className="footer-title">EcoAlbum Panamá</h3>
              <p className="footer-tagline">Conservando nuestra biodiversidad</p>
            </div>
          </div>
          <p className="footer-description">
            Plataforma educativa para conocer y proteger la fauna y flora 
            en peligro de extinción de Panamá.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Enlaces Rápidos</h4>
          <ul className="footer-links">
            {quickLinks.map((link) => (
              <li key={link.path} className="footer-link-item">
                <Link to={link.path} className="footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Contacto</h4>
          <ul className="footer-contact">
            <li className="contact-item">
              <span className="contact-icon"></span>
              <a href={`mailto:${contactInfo.email}`} className="contact-link">
                {contactInfo.email}
              </a>
            </li>
            <li className="contact-item">
              <span className="contact-icon"></span>
              <a href={`tel:${contactInfo.phone}`} className="contact-link">
                {contactInfo.phone}
              </a>
            </li>
            <li className="contact-item">
              <span className="contact-icon"></span>
              <span className="contact-text">{contactInfo.address}</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Proyecto Educativo</h4>
          <p className="footer-educational">
            Esta plataforma es un recurso educativo para promover la 
            conservación de especies en peligro de extinción en Panamá.
          </p>
          <div className="footer-badges">
            <span className="badge badge-conservation"> Conservación</span>
            <span className="badge badge-education"> Educación</span>
            <span className="badge badge-panama">🇵🇦 Panamá</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            &copy; {currentYear} EcoAlbum Panamá. Todos los derechos reservados.
          </p>
          <div className="footer-legal">
            <Link to="/privacidad" className="footer-legal-link">
              Política de Privacidad
            </Link>
            <span className="footer-legal-separator">•</span>
            <Link to="/terminos" className="footer-legal-link">
              Términos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;