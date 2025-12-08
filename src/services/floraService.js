/**
 * @fileoverview Servicios para consumir los endpoints de Flora de la API EcoAlbum
 * @module services/floraService
 */

import { get } from './api.js';

/**
 * @typedef {Object} Planta
 * @property {number} id_planta - ID único de la planta
 * @property {string} nombre_comun - Nombre común de la planta
 * @property {string} nombre_cientifico - Nombre científico
 * @property {string} familia - Familia botánica
 * @property {string} descripcion - Descripción de la planta
 * @property {string} habitat - Hábitat natural
 * @property {string} distribucion - Distribución geográfica
 * @property {string} importancia_ecologica - Importancia ecológica
 * @property {string} estado - Estado de conservación
 */

/**
 * @typedef {Object} FotoPlanta
 * @property {number} id_foto - ID único de la foto
 * @property {string} url_foto - URL de la imagen
 * @property {string} descripcion - Descripción de la foto
 */

/**
 * @typedef {Object} FloraFilters
 * @property {string} [q] - Búsqueda por nombre común o científico
 * @property {string} [familia] - Filtrar por familia botánica
 * @property {string} [estado] - Estado de conservación
 * @property {string} [letra] - Filtrar por letra inicial
 * @property {number} [page] - Número de página
 * @property {string} [ordering] - Campo de ordenamiento
 */

/**
 * @typedef {Object} PaginatedPlantas
 * @property {number} count - Número total de plantas
 * @property {string|null} next - URL de la siguiente página
 * @property {string|null} previous - URL de la página anterior
 * @property {Planta[]} results - Lista de plantas
 */

// ============================================================================
// PLANTAS
// ============================================================================

/**
 * Obtiene la lista de plantas con filtros opcionales
 * @param {FloraFilters} [filters={}] - Filtros de búsqueda
 * @returns {Promise<PaginatedPlantas>} Lista paginada de plantas
 * @example
 * // Obtener todas las plantas
 * const plantas = await getPlantas();
 * 
 * // Buscar por nombre
 * const orquideas = await getPlantas({ q: 'orquidea' });
 * 
 * // Filtrar por familia y estado
 * const plantasVulnerables = await getPlantas({ 
 *   familia: 'Orchidaceae', 
 *   estado: 'Vulnerable (VU)' 
 * });
 */
export async function getPlantas(filters = {}) {
  return get('/flora/flora/', filters);
}

/**
 * Obtiene el detalle de una planta por su ID
 * @param {number|string} id - ID de la planta
 * @returns {Promise<Planta>} Detalle de la planta
 * @example
 * const guayacan = await getPlantaById(1);
 */
export async function getPlantaById(id) {
  return get(`/flora/flora/${id}/`);
}

/**
 * Obtiene las fotos de una planta
 * @param {number|string} id - ID de la planta
 * @returns {Promise<FotoPlanta[]>} Lista de fotos de la planta
 * @example
 * const fotos = await getPlantaFotos(1);
 */
export async function getPlantaFotos(id) {
  return get(`/flora/flora/${id}/fotos/`);
}

/**
 * Obtiene toda la información de una planta (detalle + fotos)
 * @param {number|string} id - ID de la planta
 * @returns {Promise<{planta: Planta, fotos: FotoPlanta[]}>}
 * @example
 * const { planta, fotos } = await getPlantaCompleta(1);
 */
export async function getPlantaCompleta(id) {
  const [planta, fotos] = await Promise.all([
    getPlantaById(id),
    getPlantaFotos(id),
  ]);

  return { planta, fotos };
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Estados de conservación disponibles para flora
 * @constant {string[]}
 */
export const ESTADOS_CONSERVACION = [
  'Preocupación menor (LC)',
  'Casi amenazada (NT)',
  'Vulnerable (VU)',
  'En peligro (EN)',
  'En peligro crítico (CR)',
  'Extinta en estado silvestre (EW)',
  'Extinta (EX)',
  'Datos insuficientes (DD)',
  'No evaluado (NE)',
];

/**
 * Busca plantas por nombre (común o científico)
 * @param {string} query - Término de búsqueda
 * @returns {Promise<PaginatedPlantas>} Resultados de la búsqueda
 */
export async function buscarPlantas(query) {
  return getPlantas({ q: query });
}

/**
 * Obtiene plantas por familia botánica
 * @param {string} familia - Nombre de la familia
 * @returns {Promise<PaginatedPlantas>} Plantas de esa familia
 */
export async function getPlantasPorFamilia(familia) {
  return getPlantas({ familia });
}

/**
 * Obtiene plantas por estado de conservación
 * @param {string} estado - Estado de conservación
 * @returns {Promise<PaginatedPlantas>} Plantas con ese estado
 */
export async function getPlantasPorEstado(estado) {
  return getPlantas({ estado });
}

/**
 * Obtiene plantas por letra inicial del nombre común
 * @param {string} letra - Letra inicial (A-Z)
 * @returns {Promise<PaginatedPlantas>} Plantas que empiezan con esa letra
 */
export async function getPlantasPorLetra(letra) {
  return getPlantas({ letra: letra.toUpperCase() });
}

/**
 * Obtiene plantas en peligro (estados críticos)
 * @returns {Promise<PaginatedPlantas>} Plantas en peligro crítico o en peligro
 */
export async function getPlantasEnPeligro() {
  // Nota: La API puede requerir múltiples llamadas para diferentes estados
  // o un endpoint específico. Por ahora filtramos por EN.
  return getPlantas({ estado: 'En peligro (EN)' });
}

export default {
  // Plantas
  getPlantas,
  getPlantaById,
  getPlantaFotos,
  getPlantaCompleta,
  buscarPlantas,
  getPlantasPorFamilia,
  getPlantasPorEstado,
  getPlantasPorLetra,
  getPlantasEnPeligro,
  // Constantes
  ESTADOS_CONSERVACION,
};
