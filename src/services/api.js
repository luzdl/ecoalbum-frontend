/**
 * @fileoverview Configuración base de Axios para la API EcoAlbum
 * @module services/api
 */

import axios from 'axios';

/**
 * URL base de la API
 * @constant {string}
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * @typedef {Object} PaginatedResponse
 * @property {number} count - Número total de elementos
 * @property {string|null} next - URL de la siguiente página
 * @property {string|null} previous - URL de la página anterior
 * @property {Array} results - Array de resultados
 */

/**
 * Clase personalizada para errores de la API
 * @extends Error
 */
export class ApiError extends Error {
  /**
   * @param {string} message - Mensaje de error
   * @param {number} status - Código de estado HTTP
   * @param {Object} [data] - Datos adicionales del error
   */
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Instancia de Axios configurada para la API
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Interceptor de respuesta para manejo centralizado de errores
 */
api.interceptors.response.use(
  // Respuesta exitosa: retornar solo los datos
  (response) => response.data,
  
  // Error: transformar a ApiError
  (error) => {
    const message = error.response?.data?.detail 
      || error.response?.data?.message 
      || error.message 
      || 'Error de conexión con la API';
    
    const status = error.response?.status || 0;
    const data = error.response?.data || null;
    
    console.error(
      `[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`,
      message
    );
    
    return Promise.reject(new ApiError(message, status, data));
  }
);

/**
 * Realiza una petición GET a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} [params={}] - Parámetros de query string
 * @returns {Promise<any>} Respuesta de la API
 */
export async function get(endpoint, params = {}) {
  return api.get(endpoint, { params });
}

/**
 * Realiza una petición POST a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} [data={}] - Cuerpo de la petición
 * @param {Object} [params={}] - Parámetros de query string
 * @returns {Promise<any>} Respuesta de la API
 */
export async function post(endpoint, data = {}, params = {}) {
  return api.post(endpoint, data, { params });
}

/**
 * Realiza una petición PUT a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} [data={}] - Cuerpo de la petición
 * @param {Object} [params={}] - Parámetros de query string
 * @returns {Promise<any>} Respuesta de la API
 */
export async function put(endpoint, data = {}, params = {}) {
  return api.put(endpoint, data, { params });
}

/**
 * Realiza una petición PATCH a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} [data={}] - Cuerpo de la petición
 * @param {Object} [params={}] - Parámetros de query string
 * @returns {Promise<any>} Respuesta de la API
 */
export async function patch(endpoint, data = {}, params = {}) {
  return api.patch(endpoint, data, { params });
}

/**
 * Realiza una petición DELETE a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} [params={}] - Parámetros de query string
 * @returns {Promise<any>} Respuesta de la API
 */
export async function del(endpoint, params = {}) {
  return api.delete(endpoint, { params });
}

/**
 * Verifica el estado de la API
 * @returns {Promise<{status: string}>} Estado de la API
 */
export async function checkHealth() {
  return get('/health/');
}

export { api, API_BASE_URL };

export default {
  api,
  get,
  post,
  put,
  patch,
  del,
  checkHealth,
  ApiError,
  API_BASE_URL,
};
