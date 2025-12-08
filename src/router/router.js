/**
 * @fileoverview Router simple sin dependencias para SPA
 * @module router/router
 */

/**
 * @typedef {Object} Route
 * @property {string} path - Patrón de ruta (soporta :param para parámetros dinámicos)
 * @property {Function} component - Función que retorna el módulo de la página
 */

/**
 * @typedef {Object} RouteMatch
 * @property {Route} route - Ruta coincidente
 * @property {Object} params - Parámetros extraídos de la URL
 */

/**
 * Definición de rutas de la aplicación
 * @type {Route[]}
 */
const routes = [
  {
    path: '/',
    component: () => import('../pages/home/HomePage.js'),
  },
  {
    path: '/fauna',
    component: () => import('../pages/fauna/FaunaPage.js'),
  },
  {
    path: '/fauna/:id',
    component: () => import('../pages/fauna/FaunaDetailPage.js'),
  },
  {
    path: '/flora',
    component: () => import('../pages/flora/FloraPage.js'),
  },
  {
    path: '/flora/:id',
    component: () => import('../pages/flora/FloraDetailPage.js'),
  },
];

/**
 * Convierte un patrón de ruta en una expresión regular
 * @param {string} path - Patrón de ruta (ej: '/fauna/:id')
 * @returns {{regex: RegExp, paramNames: string[]}}
 */
function pathToRegex(path) {
  const paramNames = [];
  const regexPath = path
    .replace(/\//g, '\\/')
    .replace(/:(\w+)/g, (_, paramName) => {
      paramNames.push(paramName);
      return '([^/]+)';
    });
  
  return {
    regex: new RegExp(`^${regexPath}$`),
    paramNames,
  };
}

/**
 * Encuentra la ruta que coincide con el path actual
 * @param {string} path - Path de la URL
 * @returns {RouteMatch|null} Ruta coincidente con sus parámetros
 */
function matchRoute(path) {
  // Limpiar el path
  const cleanPath = path.replace(/\/$/, '') || '/';
  
  for (const route of routes) {
    const { regex, paramNames } = pathToRegex(route.path);
    const match = cleanPath.match(regex);
    
    if (match) {
      const params = {};
      paramNames.forEach((name, index) => {
        params[name] = match[index + 1];
      });
      
      return { route, params };
    }
  }
  
  return null;
}

/**
 * Obtiene el path actual de la URL (sin hash si usas history mode)
 * @returns {string}
 */
function getCurrentPath() {
  // Usar hash mode para compatibilidad (#/fauna, #/flora)
  const hash = window.location.hash.slice(1);
  return hash || '/';
}

/**
 * Contenedor principal de la aplicación
 * @type {HTMLElement|null}
 */
let appContainer = null;

/**
 * Ruta actual
 * @type {RouteMatch|null}
 */
let currentRoute = null;

/**
 * Renderiza la página correspondiente a la ruta
 * @param {string} [path] - Path a renderizar (opcional, usa el actual si no se provee)
 */
async function renderRoute(path) {
  const targetPath = path || getCurrentPath();
  const match = matchRoute(targetPath);
  
  if (!match) {
    // Ruta no encontrada - mostrar 404
    if (appContainer) {
      appContainer.innerHTML = `
        <div class="not-found">
          <h1>404</h1>
          <p>Página no encontrada</p>
          <a href="#/">Volver al inicio</a>
        </div>
      `;
    }
    return;
  }
  
  currentRoute = match;
  
  try {
    // Mostrar loading
    if (appContainer) {
      appContainer.innerHTML = '<div class="loading">Cargando...</div>';
    }
    
    // Cargar el módulo de la página
    const module = await match.route.component();
    
    // Renderizar la página
    if (module.render && appContainer) {
      await module.render(appContainer, match.params);
    } else if (module.default?.render && appContainer) {
      await module.default.render(appContainer, match.params);
    } else if (typeof module.default === 'function' && appContainer) {
      await module.default(appContainer, match.params);
    }
  } catch (error) {
    console.error('Error loading page:', error);
    if (appContainer) {
      appContainer.innerHTML = `
        <div class="error">
          <h1>Error</h1>
          <p>No se pudo cargar la página</p>
          <p>${error.message}</p>
          <a href="#/">Volver al inicio</a>
        </div>
      `;
    }
  }
}

/**
 * Navega a una ruta específica
 * @param {string} path - Path destino
 * @param {Object} [options] - Opciones de navegación
 * @param {boolean} [options.replace=false] - Reemplazar en el historial en vez de agregar
 */
export function navigate(path, options = {}) {
  if (options.replace) {
    window.location.replace(`#${path}`);
  } else {
    window.location.hash = path;
  }
}

/**
 * Navega hacia atrás en el historial
 */
export function goBack() {
  window.history.back();
}

/**
 * Navega hacia adelante en el historial
 */
export function goForward() {
  window.history.forward();
}

/**
 * Obtiene los parámetros de la ruta actual
 * @returns {Object} Parámetros de la ruta
 */
export function getParams() {
  return currentRoute?.params || {};
}

/**
 * Obtiene los query parameters de la URL actual
 * @returns {URLSearchParams}
 */
export function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

/**
 * Crea un enlace que funciona con el router
 * @param {string} path - Path destino
 * @param {string} text - Texto del enlace
 * @param {string} [className] - Clase CSS opcional
 * @returns {string} HTML del enlace
 */
export function createLink(path, text, className = '') {
  const isActive = getCurrentPath() === path;
  const activeClass = isActive ? 'active' : '';
  return `<a href="#${path}" class="${className} ${activeClass}">${text}</a>`;
}

/**
 * Inicializa el router
 * @param {string|HTMLElement} container - Selector o elemento contenedor
 */
export function initRouter(container) {
  // Obtener el contenedor
  if (typeof container === 'string') {
    appContainer = document.querySelector(container);
  } else {
    appContainer = container;
  }
  
  if (!appContainer) {
    console.error('Router: Container not found');
    return;
  }
  
  // Escuchar cambios en el hash
  window.addEventListener('hashchange', () => {
    renderRoute();
  });
  
  // Escuchar popstate para navegación con botones del navegador
  window.addEventListener('popstate', () => {
    renderRoute();
  });
  
  // Renderizar la ruta inicial
  // Si no hay hash, establecer el hash raíz
  if (!window.location.hash) {
    window.location.hash = '/';
  } else {
    renderRoute();
  }
}

/**
 * Agrega una nueva ruta dinámicamente
 * @param {Route} route - Nueva ruta a agregar
 */
export function addRoute(route) {
  routes.push(route);
}

/**
 * Obtiene todas las rutas registradas
 * @returns {Route[]}
 */
export function getRoutes() {
  return [...routes];
}

export default {
  initRouter,
  navigate,
  goBack,
  goForward,
  getParams,
  getQueryParams,
  createLink,
  addRoute,
  getRoutes,
};
