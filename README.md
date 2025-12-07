# EcoAlbum Frontend 🌿🦁

Frontend para el catálogo de fauna y flora protegida de Panamá. Aplicación web que consume la API de EcoAlbum para mostrar información sobre especies en peligro.

## 📁 Estructura del Proyecto

```
src/
├── assets/                      # Recursos estáticos (imágenes, íconos, fuentes)
│
├── components/
│   ├── common/                  # Componentes reutilizables
│   │   ├── Button.js           # Botón reutilizable
│   │   ├── Loader.js           # Indicador de carga
│   │   └── ErrorMessage.js     # Componente para mostrar errores
│   │
│   ├── layout/                  # Componentes de estructura
│   │   ├── Header.js           # Encabezado con navegación
│   │   ├── Footer.js           # Pie de página
│   │   └── Layout.js           # Wrapper principal
│   │
│   ├── cards/                   # Tarjetas de información
│   │   ├── FlipCard.js         # Tarjeta que se voltea (frente/dorso)
│   │   ├── FlipCard.css        # Estilos para efecto flip 3D
│   │   ├── AnimalCard.js       # Tarjeta específica para fauna
│   │   └── PlantCard.js        # Tarjeta específica para flora
│   │
│   ├── carousels/               # Componentes de carrusel
│   │   ├── NewsCarousel.js     # Carrusel de noticias (destacados)
│   │   ├── GalleryCarousel.js  # Carrusel de galería con enlaces a fichas
│   │   └── Carousel.css        # Estilos compartidos de carruseles
│   │
│   ├── gallery/                 # Componentes de galería
│   │   ├── Gallery.js          # Galería principal con grid
│   │   ├── GalleryItem.js      # Ítem individual de la galería
│   │   └── Gallery.css         # Estilos de la galería
│   │
│   ├── filters/                 # Componentes de filtrado
│   │   ├── FilterBar.js        # Barra de filtros
│   │   ├── SearchInput.js      # Campo de búsqueda
│   │   ├── CategoryFilter.js   # Filtro por categoría (fauna)
│   │   ├── StatusFilter.js     # Filtro por estado de conservación
│   │   ├── LetterFilter.js     # Filtro alfabético
│   │   └── Filters.css         # Estilos de filtros
│   │
│   └── modal/                   # Componentes modales
│       ├── Modal.js            # Modal base
│       ├── SpeciesDetailModal.js # Modal ampliado de especie
│       └── Modal.css           # Estilos del modal
│
├── pages/
│   ├── home/                    # Página de inicio
│   │   ├── HomePage.js         # Componente principal
│   │   ├── NewsSection.js      # Sección de noticias
│   │   ├── GallerySection.js   # Sección de galería
│   │   └── HomePage.css        # Estilos de la página
│   │
│   ├── fauna/                   # Página de fauna
│   │   ├── FaunaPage.js        # Página principal de fauna
│   │   ├── FaunaGallery.js     # Galería filtrable de animales
│   │   └── FaunaPage.css       # Estilos de la página
│   │
│   └── flora/                   # Página de flora
│       ├── FloraPage.js        # Página principal de flora
│       ├── FloraGallery.js     # Galería filtrable de plantas
│       └── FloraPage.css       # Estilos de la página
│
├── services/                    # Servicios de API
│   ├── api.js                  # Configuración base de fetch/axios
│   ├── faunaService.js         # Servicios para fauna
│   ├── floraService.js         # Servicios para flora
│   └── galleryService.js       # Servicios para galería
│
├── utils/                       # Utilidades
│   ├── constants.js            # Constantes (URLs, estados, etc.)
│   └── helpers.js              # Funciones auxiliares
│
├── styles/                      # Estilos globales
│   ├── variables.css           # Variables CSS (colores, fuentes, etc.)
│   ├── reset.css               # Reset de estilos
│   └── global.css              # Estilos globales
│
├── router/                      # Configuración de rutas
│   └── router.js               # Definición de rutas
│
├── main.js                      # Punto de entrada
└── style.css                    # Estilos principales
```

---

## 📄 Contenido de Cada Archivo

### 🔧 Services (Servicios de API)

#### `services/api.js`
```javascript
// Configuración base para llamadas a la API
const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchApi(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}
```

#### `services/faunaService.js`
```javascript
// Servicios para fauna
// - getAnimales(params) - GET /api/fauna/?q=&categoria=&estado=&letra=
// - getAnimalById(id) - GET /api/fauna/{id}/
// - getAnimalFotos(id) - GET /api/fauna/{id}/fotos/
// - getAnimalAmenazas(id) - GET /api/fauna/{id}/amenazas/
// - getAnimalAcciones(id) - GET /api/fauna/{id}/acciones/
// - getCategorias() - GET /api/fauna/categorias/
// - getAmenazas() - GET /api/fauna/amenazas/
// - getAccionesProteccion() - GET /api/fauna/acciones-proteccion/
```

#### `services/floraService.js`
```javascript
// Servicios para flora
// - getPlantas(params) - GET /api/flora/?q=&estado=&letra=
// - getPlantaById(id) - GET /api/flora/{id}/
// - getPlantaFotos(id) - GET /api/flora/{id}/fotos/
```

#### `services/galleryService.js`
```javascript
// Servicios para galería
// - getDestacados(limit, tipo) - GET /api/galeria/destacados/?limit=&tipo=
// - getAleatorios(limit, tipo) - GET /api/galeria/aleatorios/?limit=&tipo=
// - getEstadisticas() - GET /api/galeria/estadisticas/
```

---

### 🎴 Componentes de Tarjetas (Cards)

#### `components/cards/FlipCard.js`
```javascript
// Tarjeta con efecto flip 3D
// Props:
//   - frontContent: Contenido del frente (imagen, nombre)
//   - backContent: Contenido del dorso (descripción breve)
//   - onExpand: Función callback para abrir modal ampliado
//
// Comportamiento:
//   - Al hacer hover/click se voltea mostrando el dorso
//   - El dorso tiene un botón "Ver más" que activa onExpand
```

#### `components/cards/FlipCard.css`
```css
/* Estilos para efecto flip 3D */
/* - .flip-card: Contenedor con perspective */
/* - .flip-card-inner: Contenedor con transform-style: preserve-3d */
/* - .flip-card-front/.flip-card-back: Caras de la tarjeta */
/* - Transición: rotateY(180deg) al voltear */
```

#### `components/cards/AnimalCard.js`
```javascript
// Tarjeta de animal usando FlipCard
// Datos del frente:
//   - foto_principal
//   - nombre_comun
//   - estado (badge de conservación)
//
// Datos del dorso:
//   - nombre_cientifico
//   - descripcion (truncada)
//   - categoria
//   - Botón "Ampliar información"
```

#### `components/cards/PlantCard.js`
```javascript
// Tarjeta de planta usando FlipCard
// Datos del frente:
//   - foto_principal
//   - nombre_comun
//   - estado (badge de conservación)
//
// Datos del dorso:
//   - nombre_cientifico
//   - descripcion (truncada)
//   - distribucion
//   - Botón "Ampliar información"
```

---

### 🎠 Componentes de Carrusel

#### `components/carousels/NewsCarousel.js`
```javascript
// Carrusel de noticias/destacados para página de inicio
// - Consume: GET /api/galeria/destacados/
// - Muestra fotos con información de especies
// - Auto-reproducción con indicadores
```

#### `components/carousels/GalleryCarousel.js`
```javascript
// Carrusel de galería para página de inicio
// - Consume: GET /api/galeria/aleatorios/
// - Al hacer click en imagen: navega a /fauna/{id} o /flora/{id}
// - Según el campo 'tipo' de la respuesta ('fauna' o 'flora')
```

---

### 🖼️ Componentes de Galería

#### `components/gallery/Gallery.js`
```javascript
// Galería principal con grid responsive
// Props:
//   - items: Array de especies
//   - type: 'fauna' | 'flora'
//   - onItemClick: Callback al hacer click
//   - loading: Estado de carga
//
// Renderiza un grid de FlipCards
```

#### `components/gallery/GalleryItem.js`
```javascript
// Ítem individual de galería
// Envuelve AnimalCard o PlantCard según el tipo
```

---

### 🔍 Componentes de Filtros

#### `components/filters/FilterBar.js`
```javascript
// Barra de filtros contenedora
// Agrupa: SearchInput, CategoryFilter, StatusFilter, LetterFilter
// Emite evento onChange con todos los filtros combinados
```

#### `components/filters/SearchInput.js`
```javascript
// Campo de búsqueda (parámetro: q)
// Búsqueda por nombre común o científico
```

#### `components/filters/CategoryFilter.js`
```javascript
// Filtro por categoría (solo fauna)
// Opciones desde: GET /api/fauna/categorias/
// Categorías: Aves, Mamíferos, Reptiles, Peces marinos, Equinodermos, Anfibios
```

#### `components/filters/StatusFilter.js`
```javascript
// Filtro por estado de conservación
// Opciones:
//   - Preocupación menor (LC)
//   - Casi amenazado (NT) [solo fauna]
//   - Vulnerable (VU)
//   - En peligro (EN)
//   - Peligro crítico (CR)
```

#### `components/filters/LetterFilter.js`
```javascript
// Filtro alfabético (A-Z)
// Filtra por primera letra del nombre común
```

---

### 🪟 Componentes de Modal

#### `components/modal/Modal.js`
```javascript
// Modal base reutilizable
// Props:
//   - isOpen: boolean
//   - onClose: función
//   - children: contenido
//   - title: título opcional
```

#### `components/modal/SpeciesDetailModal.js`
```javascript
// Modal ampliado de especie
// Para FAUNA muestra:
//   - Todas las fotos (carrusel)
//   - nombre_comun, nombre_cientifico
//   - descripcion completa
//   - habitat
//   - distribucion
//   - importancia_ecologica
//   - estado de conservación
//   - categoria
//   - amenazas (lista)
//   - acciones_proteccion (lista)
//
// Para FLORA muestra:
//   - Todas las fotos (carrusel)
//   - nombre_comun, nombre_cientifico
//   - descripcion completa
//   - distribucion
//   - estado de conservación
```

---

### 📄 Páginas

#### `pages/home/HomePage.js`
```javascript
// Página de inicio
// Secciones:
//   1. Hero/Banner
//   2. NewsCarousel - Noticias/Destacados
//   3. GalleryCarousel - Galería con links a fichas
//   4. Estadísticas (opcional) - desde /api/galeria/estadisticas/
```

#### `pages/fauna/FaunaPage.js`
```javascript
// Página de fauna
// Componentes:
//   1. Título y descripción
//   2. FilterBar con todos los filtros
//   3. FaunaGallery con las tarjetas flippeables
//   4. SpeciesDetailModal para vista ampliada
```

#### `pages/flora/FloraPage.js`
```javascript
// Página de flora
// Componentes:
//   1. Título y descripción
//   2. FilterBar (sin filtro de categoría)
//   3. FloraGallery con las tarjetas flippeables
//   4. SpeciesDetailModal para vista ampliada
```

---

### 🛤️ Router

#### `router/router.js`
```javascript
// Configuración de rutas
// Rutas:
//   - / → HomePage
//   - /fauna → FaunaPage
//   - /flora → FloraPage
```

---

### 🎨 Estilos

#### `styles/variables.css`
```css
/* Variables CSS */
:root {
  /* Colores principales */
  --color-primary: #2d5a27;      /* Verde bosque */
  --color-secondary: #8b4513;    /* Marrón tierra */
  --color-accent: #f4a460;       /* Naranja arena */
  
  /* Estados de conservación */
  --color-lc: #4caf50;           /* Preocupación menor - Verde */
  --color-nt: #8bc34a;           /* Casi amenazado - Verde claro */
  --color-vu: #ffeb3b;           /* Vulnerable - Amarillo */
  --color-en: #ff9800;           /* En peligro - Naranja */
  --color-cr: #f44336;           /* Peligro crítico - Rojo */
  
  /* Tipografía, espaciados, breakpoints, etc. */
}
```

---

## 🌐 API Endpoints Utilizados

### Fauna
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| GET | `/api/fauna/` | Lista animales | `q`, `categoria`, `estado`, `letra` |
| GET | `/api/fauna/{id}/` | Detalle animal | - |
| GET | `/api/fauna/{id}/fotos/` | Fotos de animal | - |
| GET | `/api/fauna/{id}/amenazas/` | Amenazas | - |
| GET | `/api/fauna/{id}/acciones/` | Acciones de protección | - |
| GET | `/api/fauna/categorias/` | Categorías | - |

### Flora
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| GET | `/api/flora/` | Lista plantas | `q`, `estado`, `letra` |
| GET | `/api/flora/{id}/` | Detalle planta | - |
| GET | `/api/flora/{id}/fotos/` | Fotos de planta | - |

### Galería
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| GET | `/api/galeria/destacados/` | Fotos destacadas | `limit`, `tipo` |
| GET | `/api/galeria/aleatorios/` | Fotos aleatorias | `limit`, `tipo` |
| GET | `/api/galeria/estadisticas/` | Estadísticas | - |

---

## 🚀 Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

## 📋 Requisitos
- Node.js 18+
- API de EcoAlbum corriendo en `http://localhost:8000`

---

## 📝 Notas de Implementación

### Efecto Flip de Tarjetas
- Usar CSS 3D transforms
- `perspective` en contenedor padre
- `transform-style: preserve-3d` en el elemento que rota
- `backface-visibility: hidden` en ambas caras

### Modal Ampliado
- Se activa desde el botón en el dorso de la tarjeta
- Carga datos completos con llamadas adicionales a la API
- Overlay oscuro sobre la galería
- Cierre con click fuera o botón X