/**
 * @fileoverview Documento de verificación de integración con la API EcoAlbum
 * @module INTEGRATION_VERIFICATION
 */

/*
 * ============================================================================
 * VERIFICACIÓN DE INTEGRACIÓN CON API EcoAlbum
 * ============================================================================
 *
 * ENDPOINTS UTILIZADOS - FAUNA:
 * 
 * 1. GET /api/fauna/ 
 *    - Obtiene lista paginada de animales
 *    - Filtros soportados: q (búsqueda), categoria, estado, letra, page, ordering
 *    - Implementado en: src/services/faunaService.js :: getAnimales()
 * 
 * 2. GET /api/fauna/{id}/
 *    - Obtiene detalles de un animal específico
 *    - Implementado en: src/services/faunaService.js :: getAnimalById(id)
 * 
 * 3. GET /api/fauna/{id}/fotos/
 *    - Obtiene fotos de un animal
 *    - Implementado en: src/services/faunaService.js :: getAnimalFotos(id)
 * 
 * 4. GET /api/fauna/{id}/amenazas/
 *    - Obtiene amenazas de un animal
 *    - Implementado en: src/services/faunaService.js :: getAnimalAmenazas(id)
 * 
 * 5. GET /api/fauna/{id}/acciones/
 *    - Obtiene acciones de protección
 *    - Implementado en: src/services/faunaService.js :: getAnimalAcciones(id)
 *
 * ============================================================================
 * ENDPOINTS UTILIZADOS - FLORA:
 * 
 * 1. GET /api/flora/
 *    - Obtiene lista paginada de plantas
 *    - Filtros soportados: q (búsqueda), familia, estado, letra, page, ordering
 *    - Implementado en: src/services/floraService.js :: getPlantas()
 * 
 * 2. GET /api/flora/{id}/
 *    - Obtiene detalles de una planta específica
 *    - Implementado en: src/services/floraService.js :: getPlantaById(id)
 * 
 * 3. GET /api/flora/{id}/fotos/
 *    - Obtiene fotos de una planta
 *    - Implementado en: src/services/floraService.js :: getPlantaFotos(id)
 * 
 * ============================================================================
 * FLUJO DE DATOS - FAUNA
 * ============================================================================
 *
 * 1. CARGAR PÁGINA FAUNA:
 *    FaunaPage.js (render)
 *      ↓
 *    loadGallery(container, getAnimales, {}, { type: 'fauna' })
 *      ↓
 *    getAnimales() → GET /api/fauna/
 *      ↓
 *    Respuesta API: { count, next, previous, results: [Animal, ...] }
 *      ↓
 *    renderGallery(results, { type: 'fauna' })
 *      ↓
 *    Para cada animal:
 *      mapItemData(animal, 'fauna') - Convierte campos de API a formato tarjeta
 *      renderAnimalCard(mapped) - Crea tarjeta con FlipCard
 *
 * ============================================================================
 * FLUJO DE DATOS - FLORA
 * ============================================================================
 *
 * 1. CARGAR PÁGINA FLORA:
 *    FloraPage.js (render)
 *      ↓
 *    loadGallery(container, getPlantas, {}, { type: 'flora' })
 *      ↓
 *    getPlantas() → GET /api/flora/
 *      ↓
 *    Respuesta API: { count, next, previous, results: [Planta, ...] }
 *      ↓
 *    renderGallery(results, { type: 'flora' })
 *      ↓
 *    Para cada planta:
 *      mapItemData(planta, 'flora') - Convierte campos de API a formato tarjeta
 *      renderPlantCard(mapped) - Crea tarjeta con FlipCard
 *
 * ============================================================================
 * MAPEO DE DATOS (Gallery.js :: mapItemData)
 * ============================================================================
 *
 *    FAUNA:
 *    ─────────────────────────────────────────
 *    API Fields          →  Card Fields
 *    id_animal           →  url (#/fauna/{id})
 *    nombre_comun        →  name
 *    nombre_cientifico   →  scientificName
 *    url_imagen          →  image
 *    estado              →  status (convierte "Vulnerable (VU)" → "vu")
 *    habitat             →  habitat
 *    distribucion        →  region
 *    descripcion         →  summary
 *
 *    FLORA:
 *    ─────────────────────────────────────────
 *    API Fields          →  Card Fields
 *    id_planta           →  url (#/flora/{id})
 *    nombre_comun        →  name
 *    nombre_cientifico   →  scientificName
 *    url_imagen          →  image
 *    estado              →  status (convierte "Vulnerable (VU)" → "vu")
 *    habitat             →  habitat
 *    distribucion        →  region
 *    descripcion         →  summary
 *
 * ============================================================================
 * COMPONENTES CREADOS/MODIFICADOS
 * ============================================================================
 *
 * ✅ src/components/gallery/Gallery.js (CREADO/MEJORADO)
 *    - renderGallery(items, options) - Soporta fauna Y flora
 *    - loadGallery(container, fetchFn, filters, options) - Carga datos y renderiza
 *    - mapItemData(item, type) - Mapea datos de API a formato tarjeta (fauna/flora)
 *    - Importa renderAnimalCard Y renderPlantCard
 *
 * ✅ src/pages/fauna/FaunaPage.js (MODIFICADO)
 *    - Ahora importa getAnimales y loadGallery
 *    - Llama a loadGallery con type='fauna'
 *    - Renderiza galería dinámicamente desde API
 *
 * ✅ src/pages/flora/FloraPage.js (MODIFICADO)
 *    - Ahora importa getPlantas y loadGallery
 *    - Llama a loadGallery con type='flora'
 *    - Renderiza galería dinámicamente desde API
 *
 * ✅ src/components/cards/AnimalCard.js (SIN CAMBIOS)
 *    - Ya soportaba el formato esperado
 *    - Renderiza tarjetas de fauna
 *
 * ✅ src/components/cards/PlantCard.js (SIN CAMBIOS)
 *    - Ya soportaba el formato esperado
 *    - Renderiza tarjetas de flora
 *
 * ✅ src/components/filters/FilterBar.js (CREADO)
 *    - renderFilterBar(options) - Crea barra de filtros
 *    - Soporta búsqueda, categoría, estado, letra inicial
 *    - Callback onFilter para aplicar filtros
 *
 * ============================================================================
 * VERIFICACIÓN DE CORRECCIÓN
 * ============================================================================
 *
 * FAUNA - Antes:
 *   - FaunaPage mostraba placeholders estáticos
 *   - No había conexión con la API
 *   - AnimalCard no se estaba usando
 *
 * FAUNA - Después:
 *   ✅ FaunaPage llama a getAnimales()
 *   ✅ Datos se cargan dinámicamente desde GET /api/fauna/
 *   ✅ Cada animal se mapea correctamente a AnimalCard
 *   ✅ Las tarjetas se renderizan como FlipCards
 *   ✅ Se soportan filtros de búsqueda y categoría
 *   ✅ Manejo de errores implementado
 *
 * FLORA - Antes:
 *   - FloraPage mostraba placeholders estáticos
 *   - No había conexión con la API
 *   - PlantCard no se estaba usando
 *
 * FLORA - Después:
 *   ✅ FloraPage llama a getPlantas()
 *   ✅ Datos se cargan dinámicamente desde GET /api/flora/
 *   ✅ Cada planta se mapea correctamente a PlantCard
 *   ✅ Las tarjetas se renderizan como FlipCards
 *   ✅ Se soportan filtros de búsqueda y estado
 *   ✅ Manejo de errores implementado
 *
 * ============================================================================
 */

// Este archivo es solo documentación. No contiene código ejecutable.
