/**
 * @fileoverview Componente de galería para mostrar tarjetas de fauna o flora
 * @module components/gallery/Gallery
 */

import { renderAnimalCard } from '../cards/AnimalCard.js';
import { renderPlantCard } from '../cards/PlantCard.js';

/**
 * Mapea datos de la API a formato esperado por AnimalCard o PlantCard
 * @param {Object} item - Datos del animal o planta de la API
 * @param {string} [type='fauna'] - Tipo de item (fauna o flora)
 * @returns {Object} Datos mapeados para la tarjeta
 */
function mapItemData(item, type = 'fauna') {
  // Extraer el código de estado de conservación (ej: "Vulnerable (VU)" -> "vu")
  const estadoMatch = item.estado?.match(/\((\w+)\)/);
  const statusCode = estadoMatch ? estadoMatch[1].toLowerCase() : 'lc';

  // Determinar ID según tipo
  const itemId = type === 'fauna' ? (item.id_animal || item.id) : (item.id_planta || item.id);
  const routePrefix = type === 'fauna' ? 'fauna' : 'flora';

  // Imagen: si existe url_imagen usarla, si no usar placeholder
  const imageUrl = item.url_imagen || item.foto_principal?.url_foto || item.foto_principal || '/placeholder.jpg';

  return {
    name: item.nombre_comun || 'Sin nombre',
    scientificName: item.nombre_cientifico || '',
    image: imageUrl,
    status: statusCode,
    habitat: item.habitat || 'Desconocido',
    region: item.distribucion || 'Panamá',
    summary: item.descripcion || '',
    type: type === 'fauna' ? 'Mamífero' : 'Planta',
    url: `#/${routePrefix}/${itemId}`,
  };
}

/**
 * Renderiza una galería de tarjetas de fauna o flora
 * @param {Array} items - Array de items (animales o plantas) de la API
 * @param {Object} [options={}] - Opciones de configuración
 * @param {string} [options.size='md'] - Tamaño de las tarjetas (sm, md, lg)
 * @param {boolean} [options.glass=false] - Usar efecto glass en las tarjetas
 * @param {string} [options.type='fauna'] - Tipo de item (fauna o flora)
 * @returns {HTMLElement} Elemento con la galería renderizada
 * @example
 * const animales = await getAnimales();
 * const gallery = renderGallery(animales.results, { size: 'md', type: 'fauna' });
 * container.appendChild(gallery);
 */
export function renderGallery(items = [], { size = 'md', glass = false, type = 'fauna' } = {}) {
  const container = document.createElement('div');
  container.className = 'gallery-grid';
  
  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="gallery-empty">
        <p>No hay ${type === 'fauna' ? 'animales' : 'plantas'} disponibles</p>
      </div>
    `;
    return container;
  }

  // Seleccionar la función de renderizado según tipo
  const renderCardFn = type === 'fauna' ? renderAnimalCard : renderPlantCard;

  // Crear grid
  const grid = document.createElement('div');
  grid.className = 'grid grid-3';

  // Mapear y renderizar tarjetas (las funciones retornan HTMLElements)
  items.forEach(item => {
    try {
      const mappedData = mapItemData(item, type);
      const cardElement = renderCardFn(mappedData, { size, glass });
      if (cardElement instanceof HTMLElement) {
        grid.appendChild(cardElement);
      }
    } catch (error) {
      console.warn(`Error renderizando tarjeta para ${item.nombre_comun}:`, error);
    }
  });

  container.appendChild(grid);
  return container;
}

/**
 * Carga animales desde la API y renderiza la galería en un contenedor
 * @param {HTMLElement} container - Elemento contenedor
 * @param {Function} fetchFn - Función para obtener datos (ej: getAnimales)
 * @param {Object} [filters={}] - Filtros a aplicar
 * @param {Object} [options={}] - Opciones de renderizado
 * @returns {Promise<void>}
 * @example
 * const container = document.getElementById('fauna-gallery');
 * await loadGallery(container, getAnimales);
 */
export async function loadGallery(container, fetchFn, filters = {}, options = {}) {
  try {
    // Mostrar loading
    container.innerHTML = '<div class="gallery-loading"><p>Cargando...</p></div>';

    // Obtener datos de la API
    const response = await fetchFn(filters);
    const items = response.results || response;

    // Renderizar galería
    const gallery = renderGallery(items, options);
    container.innerHTML = '';
    container.appendChild(gallery);
  } catch (error) {
    console.error('Error cargando galería:', error);
    container.innerHTML = `
      <div class="gallery-error">
        <p>Error al cargar los datos: ${error.message}</p>
        <button onclick="location.reload()">Reintentar</button>
      </div>
    `;
  }
}

export default { renderGallery, loadGallery };
