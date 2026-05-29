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
- [x] Configurar proyecto en Cloudflare Pages (inicio despliegue).
- [x] Configurar Workers para backend/API (inicio despliegue).
- [x] Configurar bucket R2 para media.
- [x] Configurar base de datos D1.
- [ ] Definir politicas de acceso y llaves.
- [x] Configurar variables de entorno seguras.
- [ ] Probar deploy inicial end-to-end.

Subtareas despliegue inicial GUI
- [x] Publicar primer entorno para revision visual de paginas.
- [x] Conectar frontend desplegado con API Worker desplegada.
- [x] Validar CRUD basico en entorno desplegado.

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
- [ ] Crear super admin temporal para QA de GUI (credenciales fuera del repositorio, gestionadas como secreto).

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
- [x] Mostrar tarjeta de agente en detalle de propiedad.

## Fase 7 - Portal publico inmobiliario
- [x] Construir pagina Home.
- [ ] Construir listado de propiedades.
- [x] Construir detalle de propiedad.
- [ ] Construir pagina de contacto.
- [ ] Implementar vista grid/lista.

Subtareas buscador
- [x] Filtro por venta/renta.
- [ ] Filtro por tipo de propiedad.
- [ ] Filtro por ciudad.
- [ ] Filtro por zona.
- [ ] Filtro por rango de precio.
- [ ] Filtro por habitaciones.

## Fase 8 - Templates y branding
- [x] Implementar Template 1 (Modern Minimal).
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

Subtareas GUI super admin
- [x] Implementar primera pantalla Super Admin (Agencies Overview) basada en referencia visual.
- [ ] Iterar ajustes visuales por seccion segun feedback.

Subtareas GUI agencia
- [x] Implementar pantalla Gestion de Propiedades basada en stitch_nexus_re_propertyManagement (estructura inicial en espanol).
- [x] Habilitar navegacion funcional Dashboard <-> Propiedades en panel de agencia.
- [x] Migrar navegacion a rutas reales separadas: /agency/ y /agency/propiedades/ (sin hash interno).
- [ ] Ajuste visual fino 1:1 respecto al mock (espaciados y detalles de tabla/filtros).
- [x] Implementar pantalla Nueva Propiedad basada en stitch_nexus_re_crear_propiedad.
- [x] Conectar navegacion a /agency/nueva-propiedad/ desde CTAs de dashboard/propiedades/sidebar.
- [x] Agregar boton Vista Previa y modal de resumen en Nueva Propiedad.
- [x] Bloquear publicacion en UI si faltan titulo, precios requeridos o minimo una imagen.
- [x] Mejorar bloque Amenidades con buscador, scroll visible y alta de amenidad personalizada (icono + nombre).
- [x] Agregar bloque Formulario Personalizado con campo HTML condicional.
- [x] Ajustar score de listing para completar 100% al llenar todos los bloques clave.
- [x] Agregar ubicacion estructurada por Departamento y Municipio de Guatemala.
- [x] Agregar direccion en texto plano antes del mapa.
- [x] Cambiar precios de venta y renta a Quetzales.
- [x] Estilizar el buscador de amenidades.
- [x] Cambiar selector de icono de amenidad a selector visual.
- [x] Reemplazar texto close de etiquetas por icono de borrado.
- [x] Eliminar el bloque de puntuacion del listado.
- [ ] Conectar formulario Nueva Propiedad con endpoint real de persistencia.

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
