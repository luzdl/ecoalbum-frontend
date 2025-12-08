/**
 * @fileoverview Servicios para consumir los endpoints de Fauna de la API EcoAlbum
 * @module services/faunaService
 */

import { get } from './api.js';

/**
 * @typedef {Object} Categoria
 * @property {number} id_categoria - ID único de la categoría
 * @property {string} nombre - Nombre de la categoría
 * @property {string} descripcion - Descripción de la categoría
 */

/**
 * @typedef {Object} Animal
 * @property {number} id_animal - ID único del animal
 * @property {string} nombre_comun - Nombre común del animal
 * @property {string} nombre_cientifico - Nombre científico
 * @property {string} descripcion - Descripción del animal
 * @property {string} habitat - Hábitat natural
 * @property {string} distribucion - Distribución geográfica
 * @property {string} importancia_ecologica - Importancia ecológica
 * @property {string} estado - Estado de conservación
 * @property {number} id_categoria - ID de la categoría
 */

/**
 * @typedef {Object} FotoAnimal
 * @property {number} id_foto - ID único de la foto
 * @property {string} url_foto - URL de la imagen
 * @property {string} descripcion - Descripción de la foto
 */

/**
 * @typedef {Object} Amenaza
 * @property {number} id_amenaza - ID único de la amenaza
 * @property {string} nombre - Nombre de la amenaza
 * @property {string} descripcion - Descripción de la amenaza
 */

/**
 * @typedef {Object} AccionProteccion
 * @property {number} id_accion - ID único de la acción
 * @property {string} nombre - Nombre de la acción
 * @property {string} descripcion - Descripción de la acción
 */

/**
 * @typedef {Object} FaunaFilters
 * @property {string} [q] - Búsqueda por nombre común o científico
 * @property {number|string} [categoria] - ID o nombre de la categoría
 * @property {string} [estado] - Estado de conservación
 * @property {string} [letra] - Filtrar por letra inicial
 * @property {number} [page] - Número de página
 * @property {string} [ordering] - Campo de ordenamiento
 */

/**
 * @typedef {Object} PaginatedAnimals
 * @property {number} count - Número total de animales
 * @property {string|null} next - URL de la siguiente página
 * @property {string|null} previous - URL de la página anterior
 * @property {Animal[]} results - Lista de animales
 */

// ============================================================================
// ANIMALES
// ============================================================================

/**
 * Obtiene la lista de animales con filtros opcionales
 * @param {FaunaFilters} [filters={}] - Filtros de búsqueda
 * @returns {Promise<PaginatedAnimals>} Lista paginada de animales
 * @example
 * // Obtener todos los animales
 * const animales = await getAnimales();
 * 
 * // Buscar por nombre
 * const tucanes = await getAnimales({ q: 'tucan' });
 * 
 * // Filtrar por categoría y estado
 * const avesVulnerables = await getAnimales({ 
 *   categoria: 1, 
 *   estado: 'Vulnerable (VU)' 
 * });
 */
export async function getAnimales(filters = {}) {
  return get('/fauna/', filters);
}

/**
 * Obtiene el detalle de un animal por su ID
 * @param {number|string} id - ID del animal
 * @returns {Promise<Animal>} Detalle del animal
 * @example
 * const tucan = await getAnimalById(1);
 */
export async function getAnimalById(id) {
  return get(`/fauna/${id}/`);
}

/**
 * Obtiene las fotos de un animal
 * @param {number|string} id - ID del animal
 * @returns {Promise<FotoAnimal[]>} Lista de fotos del animal
 * @example
 * const fotos = await getAnimalFotos(1);
 */
export async function getAnimalFotos(id) {
  return get(`/fauna/${id}/fotos/`);
}

/**
 * Obtiene las amenazas de un animal
 * @param {number|string} id - ID del animal
 * @returns {Promise<Amenaza[]>} Lista de amenazas del animal
 * @example
 * const amenazas = await getAnimalAmenazas(1);
 */
export async function getAnimalAmenazas(id) {
  return get(`/fauna/${id}/amenazas/`);
}

/**
 * Obtiene las acciones de protección de un animal
 * @param {number|string} id - ID del animal
 * @returns {Promise<AccionProteccion[]>} Lista de acciones de protección
 * @example
 * const acciones = await getAnimalAcciones(1);
 */
export async function getAnimalAcciones(id) {
  return get(`/fauna/${id}/acciones/`);
}

/**
 * Obtiene toda la información de un animal (detalle + fotos + amenazas + acciones)
 * @param {number|string} id - ID del animal
 * @returns {Promise<{animal: Animal, fotos: FotoAnimal[], amenazas: Amenaza[], acciones: AccionProteccion[]}>}
 * @example
 * const { animal, fotos, amenazas, acciones } = await getAnimalCompleto(1);
 */
export async function getAnimalCompleto(id) {
  const [animal, fotos, amenazas, acciones] = await Promise.all([
    getAnimalById(id),
    getAnimalFotos(id),
    getAnimalAmenazas(id),
    getAnimalAcciones(id),
  ]);

  return { animal, fotos, amenazas, acciones };
}

// ============================================================================
// CATEGORÍAS
// ============================================================================

/**
 * Obtiene todas las categorías de fauna
 * @returns {Promise<{count: number, results: Categoria[]}>} Lista de categorías
 * @example
 * const { results: categorias } = await getCategorias();
 */
export async function getCategorias() {
  return get('/fauna/categorias/');
}

/**
 * Obtiene una categoría por su ID
 * @param {number|string} id - ID de la categoría
 * @returns {Promise<Categoria>} Detalle de la categoría
 */
export async function getCategoriaById(id) {
  return get(`/fauna/categorias/${id}/`);
}

// ============================================================================
// AMENAZAS
// ============================================================================

/**
 * Obtiene todas las amenazas
 * @returns {Promise<{count: number, results: Amenaza[]}>} Lista de amenazas
 * @example
 * const { results: amenazas } = await getAmenazas();
 */
export async function getAmenazas() {
  return get('/fauna/amenazas/');
}

/**
 * Obtiene una amenaza por su ID
 * @param {number|string} id - ID de la amenaza
 * @returns {Promise<Amenaza>} Detalle de la amenaza
 */
export async function getAmenazaById(id) {
  return get(`/fauna/amenazas/${id}/`);
}

// ============================================================================
// ACCIONES DE PROTECCIÓN
// ============================================================================

/**
 * Obtiene todas las acciones de protección
 * @returns {Promise<{count: number, results: AccionProteccion[]}>} Lista de acciones
 * @example
 * const { results: acciones } = await getAccionesProteccion();
 */
export async function getAccionesProteccion() {
  return get('/fauna/acciones-proteccion/');
}

/**
 * Obtiene una acción de protección por su ID
 * @param {number|string} id - ID de la acción
 * @returns {Promise<AccionProteccion>} Detalle de la acción
 */
export async function getAccionProteccionById(id) {
  return get(`/fauna/acciones-proteccion/${id}/`);
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Estados de conservación disponibles para fauna
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
 * Categorías de fauna disponibles
 * @constant {string[]}
 */
export const CATEGORIAS_FAUNA = [
  'Aves',
  'Mamíferos',
  'Reptiles',
  'Peces marinos',
  'Equinodermos',
  'Anfibios',
];

/**
 * Busca animales por nombre (común o científico)
 * @param {string} query - Término de búsqueda
 * @returns {Promise<PaginatedAnimals>} Resultados de la búsqueda
 */
export async function buscarAnimales(query) {
  return getAnimales({ q: query });
}

/**
 * Obtiene animales por categoría
 * @param {number|string} categoriaId - ID de la categoría
 * @returns {Promise<PaginatedAnimals>} Animales de la categoría
 */
export async function getAnimalesPorCategoria(categoriaId) {
  return getAnimales({ categoria: categoriaId });
}

/**
 * Obtiene animales por estado de conservación
 * @param {string} estado - Estado de conservación
 * @returns {Promise<PaginatedAnimals>} Animales con ese estado
 */
export async function getAnimalesPorEstado(estado) {
  return getAnimales({ estado });
}

/**
 * Obtiene animales por letra inicial del nombre común
 * @param {string} letra - Letra inicial (A-Z)
 * @returns {Promise<PaginatedAnimals>} Animales que empiezan con esa letra
 */
export async function getAnimalesPorLetra(letra) {
  return getAnimales({ letra: letra.toUpperCase() });
}

export default {
  // Animales
  getAnimales,
  getAnimalById,
  getAnimalFotos,
  getAnimalAmenazas,
  getAnimalAcciones,
  getAnimalCompleto,
  buscarAnimales,
  getAnimalesPorCategoria,
  getAnimalesPorEstado,
  getAnimalesPorLetra,
  // Categorías
  getCategorias,
  getCategoriaById,
  // Amenazas
  getAmenazas,
  getAmenazaById,
  // Acciones
  getAccionesProteccion,
  getAccionProteccionById,
  // Constantes
  ESTADOS_CONSERVACION,
  CATEGORIAS_FAUNA,
};
