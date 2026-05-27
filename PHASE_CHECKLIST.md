# NEXUS RE - Checklist Maestro por Fases

Este checklist esta orientado a ejecucion incremental.
Marcar tareas a medida que se completen.

## Fase 0 - Definicion y alcance MVP
- [x] Confirmar alcance final del MVP (sin CRM interno ni leads internos).
- [x] Congelar lista de modulos v1.
- [ ] Definir criterios de aceptacion por modulo.
- [ ] Definir entregables por sprint.
- [ ] Definir riesgos y mitigaciones iniciales.

## Fase 1 - Fundacion tecnica
- [x] Seleccionar stack definitivo frontend/backend.
- [ ] Definir arquitectura multi-tenant.
- [x] Diseñar estructura del repositorio.
- [x] Configurar entorno local de desarrollo.
- [x] Inicializar repositorio Git y conectar remoto GitHub.
- [ ] Configurar estrategia de entornos (dev/staging/prod).
- [ ] Definir convenciones de codigo, ramas y releases.

## Fase 2 - Infraestructura Cloudflare + D1
- [ ] Configurar proyecto en Cloudflare Pages.
- [ ] Configurar Workers para backend/API.
- [x] Configurar bucket R2 para media.
- [x] Configurar base de datos D1.
- [ ] Definir politicas de acceso y llaves.
- [x] Configurar variables de entorno seguras.
- [ ] Probar deploy inicial end-to-end.

## Fase 3 - Modelo de datos y multi-tenant
- [x] Crear scripts SQL iniciales de tablas MVP.
- [x] Ejecutar migracion SQL en D1.
- [x] Crear tabla agencies.
- [x] Crear tabla users (roles: admin, agency_user).
- [x] Crear tabla informational_agents.
- [x] Crear tabla properties.
- [x] Crear tabla property_images.
- [x] Crear tabla property_features.
- [x] Crear tabla property_types.
- [x] Crear tabla website_settings.
- [x] Crear tabla templates.
- [x] Definir claves foraneas y constraints.
- [x] Definir indices para filtros de buscador.
- [ ] Aplicar reglas de aislamiento por agency_id.

## Fase 4 - Autenticacion y autorizacion
- [ ] Implementar login.
- [ ] Implementar control por rol.
- [ ] Implementar proteccion de rutas privadas.
- [ ] Implementar contexto de agencia activa.
- [ ] Probar aislamiento de datos entre tenants.

## Fase 5 - Modulo de propiedades (core)
- [x] Implementar CRUD de propiedades.
- [ ] Implementar validaciones de campos obligatorios.
- [ ] Implementar manejo de slug unico.
- [ ] Implementar estado borrador/publicado.
- [ ] Implementar campo featured.
- [x] Implementar relacion property -> informational_agent.

Subtareas media
- [x] Implementar subida multiple a R2.
- [x] Implementar drag/drop de imagenes.
- [x] Implementar ordenamiento de galeria.
- [x] Implementar imagen principal.
- [x] Implementar eliminacion segura de assets.

## Fase 6 - Agentes informativos
- [x] Implementar CRUD de informational_agents.
- [x] Implementar selector de agente en propiedad.
- [ ] Mostrar tarjeta de agente en detalle de propiedad.

## Fase 7 - Portal publico inmobiliario
- [ ] Construir pagina Home.
- [ ] Construir listado de propiedades.
- [ ] Construir detalle de propiedad.
- [ ] Construir pagina de contacto.
- [ ] Implementar vista grid/lista.

Subtareas buscador
- [ ] Filtro por venta/renta.
- [ ] Filtro por tipo de propiedad.
- [ ] Filtro por ciudad.
- [ ] Filtro por zona.
- [ ] Filtro por rango de precio.
- [ ] Filtro por habitaciones.

## Fase 8 - Templates y branding
- [ ] Implementar Template 1 (Modern Minimal).
- [ ] Implementar Template 2 (Luxury Premium).
- [ ] Configurar personalizacion de logo.
- [ ] Configurar colores primario/secundario.
- [ ] Configurar tipografia.
- [ ] Configurar hero y layout style.

## Fase 9 - Integracion GHL (minima MVP)
- [ ] Configurar app OAuth GHL.
- [ ] Implementar flujo de conexion de subcuenta.
- [ ] Guardar ghl_location_id.
- [ ] Guardar access_token y refresh_token.
- [ ] Guardar location_name.
- [ ] Implementar embeds globales por agencia.
- [ ] Implementar override embeds por propiedad.

## Fase 10 - SEO y URLs
- [ ] Generar meta_title por propiedad.
- [ ] Generar meta_description por propiedad.
- [ ] Generar open_graph_image.
- [ ] Implementar URLs amigables por tipo/ciudad/zona.
- [ ] Validar sitemap y metadatos base.

## Fase 11 - Panel administrativo
- [ ] Construir dashboard resumen.
- [ ] Mostrar propiedades activas.
- [ ] Mostrar propiedades destacadas.
- [ ] Mostrar ultimas agregadas.
- [ ] Implementar configuracion de portal por agencia.

## Fase 12 - Calidad, seguridad y lanzamiento
- [ ] Definir pruebas unitarias minimas.
- [ ] Definir pruebas funcionales criticas.
- [ ] Validar manejo de errores y logging.
- [ ] Revisar politicas de seguridad de tokens.
- [ ] Configurar backup y recuperacion DB.
- [ ] Preparar checklist de release.
- [ ] Ejecutar go-live controlado.

Subtareas DNS y dominio (cuando se necesite publicar dominio final)
- [ ] Crear/confirmar zona DNS de epic.gt.
- [ ] Crear CNAME para nexusre.epic.gt segun estrategia (Pages o Worker).
- [ ] Verificar propagacion DNS.
- [ ] Activar SSL/TLS en Cloudflare.
- [ ] Validar respuesta HTTPS en dominio final.

## Backlog v2 (fuera del MVP)
- [ ] Sincronizacion de usuarios reales desde GHL.
- [ ] Asignacion automatica de agentes.
- [ ] Sincronizacion avanzada de entidades GHL.
- [ ] Capacidades adicionales de automatizacion interna.
