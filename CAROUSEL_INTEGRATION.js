/**
 * @fileoverview Verificación - Carruseles Conectados a API
 * @date Diciembre 7, 2025
 */

/*
 * ============================================================================
 * VERIFICACIÓN - CARRUSELES EN HOMEPAGE CONECTADOS A API
 * ============================================================================
 *
 * ✅ INTEGRACIÓN COMPLETADA
 *
 * Se ha conectado con éxito la HomePage a los servicios de galería de la API.
 *
 * ============================================================================
 * ENDPOINTS UTILIZADOS
 * ============================================================================
 *
 * 1. GET /api/galeria/destacados/
 *    - Obtiene fotos destacadas para el carrusel de noticias
 *    - Parámetros: limit (defecto: 10), tipo (fauna/flora/all)
 *    - Implementado en: src/services/galleryService.js :: getDestacados()
 *
 * 2. GET /api/galeria/aleatorios/
 *    - Obtiene fotos aleatorias para la galería
 *    - Parámetros: limit (defecto: 10), tipo (fauna/flora/all)
 *    - Implementado en: src/services/galleryService.js :: getAleatorios()
 *
 * 3. GET /api/galeria/estadisticas/
 *    - Obtiene estadísticas (disponible para futuro uso)
 *    - Implementado en: src/services/galleryService.js :: getEstadisticas()
 *
 * ============================================================================
 * FLUJO DE DATOS - CARRUSELES
 * ============================================================================
 *
 * 1. CARGAR PÁGINA HOME:
 *    HomePage.render(container)
 *      ↓
 *    Renderiza HTML base + llama loadCarousels()
 *      ↓
 *    loadCarousels(container):
 *      ├─ getDestacados({ limit: 5 }) → GET /api/galeria/destacados/
 *      │  ↓
 *      │  Respuesta: FotoGaleria[]
 *      │  ↓
 *      │  Mapea a: { title, excerpt, cover, tag, date, href }
 *      │  ↓
 *      │  mountNewsCarousel(newsContainer, newsItems)
 *      │
 *      └─ getAleatorios({ limit: 8 }) → GET /api/galeria/aleatorios/
 *         ↓
 *         Respuesta: FotoGaleria[]
 *         ↓
 *         Mapea a: { title, caption, cover, href }
 *         ↓
 *         mountGalleryCarousel(galleryContainer, galleryItems)
 *
 * 2. RENDERIZADO DE CARRUSELES:
 *    - NewsCarousel: Autoplay, con tags, dates, botón "Leer más"
 *    - GalleryCarousel: Sin autoplay, botones "Abrir" y "Descargar"
 *
 * ============================================================================
 * MAPEO DE DATOS - GALERÍA
 * ============================================================================
 *
 * API Response (FotoGaleria)    →    Carousel Item
 * ───────────────────────────────────────────────────
 * nombre                        →    title
 * descripcion_foto              →    excerpt/caption
 * url_foto                      →    cover
 * tipo                          →    tag (🦁 Fauna / 🌿 Flora)
 * tipo + especie_id             →    href (#/fauna/{id} o #/flora/{id})
 * new Date()                    →    date
 *
 * ============================================================================
 * CAMBIOS EN HOMEPAGE.JS
 * ============================================================================
 *
 * ✅ IMPORTACIONES AGREGADAS:
 *    - import { mountNewsCarousel } from '../../components/carousels/NewsCarousel.js'
 *    - import { mountGalleryCarousel } from '../../components/carousels/GalleryCorousel.js'
 *    - import { getDestacados, getAleatorios } from '../../services/galleryService.js'
 *
 * ✅ FUNCIÓN loadCarousels() AGREGADA:
 *    - Async function que:
 *      * Obtiene datos de la API
 *      * Mapea FotoGaleria a formato de carousel
 *      * Monta carruseles con mountNewsCarousel y mountGalleryCarousel
 *      * Maneja errores y muestra mensajes apropiados
 *
 * ✅ HTML ACTUALIZADO:
 *    - Cambia placeholders por divs con IDs:
 *      * #news-carousel-container (para NewsCarousel)
 *      * #gallery-carousel-container (para GalleryCarousel)
 *    - Muestra "Cargando..." mientras se obtienen datos
 *
 * ✅ FLUJO EN render():
 *    - render(container) renderiza HTML
 *    - Llama loadCarousels(container) para cargar datos
 *    - Los carruseles se montan de forma asíncrona
 *
 * ============================================================================
 * COMPONENTES UTILIZADOS
 * ============================================================================
 *
 * ✅ NewsCarousel.js (src/components/carousels/)
 *    - mountNewsCarousel(container, items, options)
 *    - Opciones: { autoplay, interval, glass }
 *    - Cada slide tiene: cover, tag, title, date, excerpt, "Leer más"
 *
 * ✅ GalleryCarousel.js (src/components/carousels/)
 *    - mountGalleryCarousel(container, items, options)
 *    - Opciones: { autoplay, glass }
 *    - Cada slide tiene: cover, title, caption, "Abrir", "Descargar"
 *
 * ============================================================================
 * MANEJO DE ERRORES
 * ============================================================================
 *
 * ✅ Try/Catch implementado:
 *    - Si getDestacados() falla: "No hay noticias destacadas" o error
 *    - Si getAleatorios() falla: "No hay fotos disponibles" o error
 *    - Si ambos fallan: Muestra mensaje de error con detalles
 *
 * ✅ States:
 *    - Inicial: "Cargando noticias..." / "Cargando galería..."
 *    - Éxito: Carruseles renderizados
 *    - Error: Mensaje de error amigable
 *
 * ============================================================================
 * TESTING MANUAL
 * ============================================================================
 *
 * 1. Verificar que carga:
 *    - Navegar a /
 *    - Verificar que ve "Cargando..." inicialmente
 *    - Esperar a que se carguen los carruseles
 *    - Verificar que ve fotos reales (no placeholders)
 *
 * 2. Verificar peticiones API:
 *    - Abrir DevTools → Network
 *    - Confirmar GET /api/galeria/destacados/?limit=5
 *    - Confirmar GET /api/galeria/aleatorios/?limit=8
 *
 * 3. Verificar interactividad:
 *    - NewsCarousel: Autoplay debe estar activo
 *    - Cliquear siguiente/anterior
 *    - Cliquear dots de paginación
 *    - Pausar carrusel (si hay botón)
 *
 * 4. Verificar GalleryCarousel:
 *    - No debe hacer autoplay
 *    - Botones "Abrir" y "Descargar" deben ser clickeables
 *    - Links deben funcionar
 *
 * ============================================================================
 * NOTAS IMPORTANTES
 * ============================================================================
 *
 * - Los datos se cargan de forma ASÍNCRONA después de render()
 * - No bloquea la renderización inicial
 * - Las opciones están optimizadas:
 *   * NewsCarousel: autoplay=true, glass=true (destacado visual)
 *   * GalleryCarousel: autoplay=false, glass=false (neutral)
 * - El mapeo de datos preserva todos los campos necesarios
 * - Los href funcionan con el router hash (#/fauna/{id}, etc)
 *
 * ============================================================================
 * ENDPOINTS DE LA API DOCUMENTADOS
 * ============================================================================
 *
 * GET /api/galeria/destacados/?limit=5
 *   Respuesta:
 *   [
 *     {
 *       "id": 1,
 *       "tipo": "fauna",
 *       "nombre": "Jaguar",
 *       "url_foto": "https://...",
 *       "descripcion_foto": "Felino emblematico...",
 *       "especie_id": 123,
 *       "nombre_cientifico": "Panthera onca",
 *       "estado": "En peligro (EN)"
 *     },
 *     ...
 *   ]
 *
 * GET /api/galeria/aleatorios/?limit=8
 *   Respuesta: (mismo formato que destacados)
 *
 * GET /api/galeria/estadisticas/
 *   Respuesta:
 *   {
 *     "total_animales": 50,
 *     "total_plantas": 30,
 *     "total_fotos_fauna": 200,
 *     "total_fotos_flora": 150,
 *     "total_especies": 80,
 *     "total_fotos": 350
 *   }
 *
 * ============================================================================
 */

// Este archivo es documentación. No contiene código ejecutable.
