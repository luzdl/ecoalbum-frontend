/**
 * @fileoverview Servicios para consumir los endpoints de Galería de la API EcoAlbum
 * @module services/galleryService
 */

import { get } from './api.js';

/**
 * @typedef {'fauna' | 'flora'} TipoGaleria
 */

/**
 * @typedef {Object} FotoGaleria
 * @property {number} id - ID de la foto
 * @property {string} tipo - Tipo: 'fauna' o 'flora'
 * @property {string} nombre - Nombre de la especie
 * @property {string} url_foto - URL de la imagen
 * @property {string} descripcion_foto - Descripción de la foto
 * @property {number} especie_id - ID de la especie (animal o planta)
 * @property {string} [nombre_cientifico] - Nombre científico
 * @property {string} [estado] - Estado de conservación
 */

/**
 * @typedef {Object} Estadisticas
 * @property {number} total_animales - Total de animales en la base de datos
 * @property {number} total_plantas - Total de plantas en la base de datos
 * @property {number} total_fotos_fauna - Total de fotos de fauna
 * @property {number} total_fotos_flora - Total de fotos de flora
 * @property {number} total_especies - Total de especies (animales + plantas)
 * @property {number} total_fotos - Total de fotos
 */

/**
 * @typedef {Object} GalleryFilters
 * @property {number} [limit] - Cantidad de fotos a obtener (default: 10, max: 20)
 * @property {TipoGaleria} [tipo] - Filtrar por tipo: 'fauna', 'flora' o undefined para todos
 */

// ============================================================================
// GALERÍA
// ============================================================================

/**
 * Obtiene fotos destacadas para el carrusel del homepage
 * @param {Object} [options={}] - Opciones de filtrado
 * @param {number} [options.limit=10] - Cantidad de fotos (max: 20)
 * @param {TipoGaleria} [options.tipo] - Filtrar por tipo: 'fauna' o 'flora'
 * @returns {Promise<FotoGaleria[]>} Lista de fotos destacadas
 * @example
 * // Obtener 10 fotos destacadas de ambos tipos
 * const destacadas = await getDestacados();
 * 
 * // Obtener 5 fotos destacadas solo de fauna
 * const destacadasFauna = await getDestacados({ limit: 5, tipo: 'fauna' });
 */
export async function getDestacados(options = {}) {
  const { limit = 10, tipo } = options;
  const params = { limit };
  
  if (tipo) {
    params.tipo = tipo;
  }
  
  return get('/galeria/destacados/', params);
}

/**
 * Obtiene fotos aleatorias para contenido dinámico
 * @param {Object} [options={}] - Opciones de filtrado
 * @param {number} [options.limit=10] - Cantidad de fotos (max: 20)
 * @param {TipoGaleria} [options.tipo] - Filtrar por tipo: 'fauna' o 'flora'
 * @returns {Promise<FotoGaleria[]>} Lista de fotos aleatorias
 * @example
 * // Obtener 10 fotos aleatorias
 * const aleatorias = await getAleatorios();
 * 
 * // Obtener 8 fotos aleatorias solo de flora
 * const aleatoriasFlora = await getAleatorios({ limit: 8, tipo: 'flora' });
 */
export async function getAleatorios(options = {}) {
  const { limit = 10, tipo } = options;
  const params = { limit };
  
  if (tipo) {
    params.tipo = tipo;
  }
  
  return get('/galeria/aleatorios/', params);
}

/**
 * Obtiene estadísticas generales de la galería
 * @returns {Promise<Estadisticas>} Estadísticas de la galería
 * @example
 * const stats = await getEstadisticas();
 * console.log(`Total especies: ${stats.total_especies}`);
 */
export async function getEstadisticas() {
  return get('/galeria/estadisticas/');
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Tipos de galería disponibles
 * @constant {TipoGaleria[]}
 */
export const TIPOS_GALERIA = ['fauna', 'flora'];

/**
 * Límite máximo de fotos por petición
 * @constant {number}
 */
export const MAX_LIMIT = 20;

/**
 * Límite por defecto de fotos por petición
 * @constant {number}
 */
export const DEFAULT_LIMIT = 10;

/**
 * Obtiene fotos destacadas solo de fauna
 * @param {number} [limit=10] - Cantidad de fotos
 * @returns {Promise<FotoGaleria[]>} Fotos destacadas de fauna
 */
export async function getDestacadosFauna(limit = 10) {
  return getDestacados({ limit, tipo: 'fauna' });
}

/**
 * Obtiene fotos destacadas solo de flora
 * @param {number} [limit=10] - Cantidad de fotos
 * @returns {Promise<FotoGaleria[]>} Fotos destacadas de flora
 */
export async function getDestacadosFlora(limit = 10) {
  return getDestacados({ limit, tipo: 'flora' });
}

/**
 * Obtiene fotos aleatorias solo de fauna
 * @param {number} [limit=10] - Cantidad de fotos
 * @returns {Promise<FotoGaleria[]>} Fotos aleatorias de fauna
 */
export async function getAleatoriosFauna(limit = 10) {
  return getAleatorios({ limit, tipo: 'fauna' });
}

/**
 * Obtiene fotos aleatorias solo de flora
 * @param {number} [limit=10] - Cantidad de fotos
 * @returns {Promise<FotoGaleria[]>} Fotos aleatorias de flora
 */
export async function getAleatoriosFlora(limit = 10) {
  return getAleatorios({ limit, tipo: 'flora' });
}

/**
 * Genera la URL de detalle de una especie basándose en el tipo
 * @param {FotoGaleria} foto - Objeto de foto de galería
 * @returns {string} URL de la página de detalle
 * @example
 * const foto = { tipo: 'fauna', especie_id: 1 };
 * const url = getDetalleUrl(foto); // '/fauna/1'
 */
export function getDetalleUrl(foto) {
  return `/${foto.tipo}/${foto.especie_id}`;
}

/**
 * Obtiene datos para el homepage (destacados + estadísticas)
 * @param {number} [limit=10] - Cantidad de fotos destacadas
 * @returns {Promise<{destacados: FotoGaleria[], estadisticas: Estadisticas}>}
 * @example
 * const { destacados, estadisticas } = await getHomepageData();
 */
export async function getHomepageData(limit = 10) {
  const [destacados, estadisticas] = await Promise.all([
    getDestacados({ limit }),
    getEstadisticas(),
  ]);

  return { destacados, estadisticas };
}

export default {
  // Endpoints principales
  getDestacados,
  getAleatorios,
  getEstadisticas,
  // Helpers por tipo
  getDestacadosFauna,
  getDestacadosFlora,
  getAleatoriosFauna,
  getAleatoriosFlora,
  // Utilidades
  getDetalleUrl,
  getHomepageData,
  // Constantes
  TIPOS_GALERIA,
  MAX_LIMIT,
  DEFAULT_LIMIT,
};
