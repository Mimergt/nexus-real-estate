# NEXUS RE - Memoria Operativa para Agentes IA

## Objetivo de este archivo
Mantener un registro claro, acumulativo y portable de decisiones, acciones y pendientes.
Este archivo se actualiza en cada sesion para que cualquier agente o miembro del equipo pueda retomar el trabajo sin perder contexto.

## Reglas de uso
- Cada sesion agrega una nueva entrada al final.
- No borrar historial; solo corregir con una nota de aclaracion.
- Registrar decisiones tecnicas, cambios hechos, bloqueos y proximos pasos.
- Si se solicita acceso (Cloudflare, Git, GHL), dejarlo en Pendientes de acceso.

## Estado base del proyecto (MVP)
- Producto: plataforma SaaS inmobiliaria multi-tenant integrada con GoHighLevel (GHL).
- Enfoque Nexus RE: propiedades, portal, listings, branding, templates y capa visual.
- Fuera de alcance MVP: CRM interno, leads internos, inbox, pipelines y sincronizaciones completas de GHL.
- Roles MVP: super admin y agency user.
- Agentes: solo informativos (metadata), sin login ni permisos propios.
- Infra objetivo: Cloudflare Pages + Workers + R2.
- Base de datos: Cloudflare D1.
- Dominio objetivo: nexusre.epic.gt (pendiente CNAME en epic.gt).

## Plantilla de entrada por sesion
Copiar y pegar para nuevas sesiones:

Fecha:
Sesion:
Resumen:
Acciones ejecutadas:
Decisiones tomadas:
Pendientes de acceso:
Bloqueos:
Siguientes pasos:

---

## Historial de sesiones

### Fecha: 2026-05-27
Sesion: 001
Resumen:
Se definio la direccion del MVP de NEXUS RE y se solicito preparar base operativa para continuidad entre equipos.

Acciones ejecutadas:
- Creacion del archivo de memoria operativa para agentes IA.
- Creacion del checklist maestro por fases y subtareas.

Decisiones tomadas:
- GHL sera el sistema unico para leads, conversaciones, pipelines y automatizaciones.
- NEXUS RE no implementa CRM ni gestion interna de leads en v1.
- Modelo de usuarios MVP: solo super admin y agency user.
- Integracion GHL minima: OAuth para asociar agency con location y habilitar embeds.

Pendientes de acceso:
- Credenciales Cloudflare (cuando se requiera configurar Pages, Workers, R2 y DNS).
- Credenciales Git (cuando se requiera publicar repositorio y CI/CD).
- Credenciales de app OAuth GHL (cuando se implemente el modulo GHL).

Bloqueos:
- Ninguno en esta sesion.

Siguientes pasos:
- Definir arquitectura tecnica inicial y estructura del repositorio.
- Diseñar esquema de base de datos en Supabase.
- Implementar primer slice funcional: CRUD de propiedades + carga de imagenes.

### Fecha: 2026-05-27
Sesion: 002
Resumen:
Se inicio el proyecto con estructura monorepo funcional (web + API + shared) y scripts operativos desde raiz.

Acciones ejecutadas:
- Scaffolding de apps/web con React + Vite + TypeScript.
- Creacion de apps/api con Cloudflare Worker + Hono + TypeScript.
- Creacion de packages/shared para esquemas y tipos compartidos.
- Configuracion de package.json raiz con workspaces y scripts.
- Creacion de .env.example, .gitignore, tsconfig.base.json y README.md.
- Validacion de compilacion de web y typecheck de API.
- Ajuste de checklist: DNS/dominio movido a fase de lanzamiento, no como bloqueo inicial.

Decisiones tomadas:
- Stack MVP inicial confirmado: web en Vite y API en Worker independiente.
- Mantener el tema de dominio como tarea diferida hasta fase de publicacion final.

Pendientes de acceso:
- Cloudflare: Account ID y API token para despliegues reales.
- GHL: client_id/client_secret para OAuth.

Bloqueos:
- Ninguno.

Siguientes pasos:
- Crear esquema SQL inicial en Supabase (agencies/users/properties/informational_agents).
- Implementar auth y contexto de agency.
- Iniciar CRUD de propiedades.

### Fecha: 2026-05-27
Sesion: 003
Resumen:
Se implemento el primer slice de backend con esquema SQL inicial y CRUD de propiedades multi-tenant.

Acciones ejecutadas:
- Creacion de migracion SQL inicial en supabase/migrations/20260527_001_initial_schema.sql.
- Creacion de guia de uso en supabase/README.md.
- Implementacion de endpoints CRUD de propiedades en apps/api/src/index.ts.
- Integracion de @supabase/supabase-js en la API.
- Validaciones de payload con zod para create/update de propiedades.
- Aislamiento por agencia usando header temporal x-agency-id.
- Actualizacion de README.md con endpoints y flujo local de variables.
- Actualizacion de PHASE_CHECKLIST.md con avance real.

Decisiones tomadas:
- Para acelerar MVP, el contexto tenant usa header temporal x-agency-id hasta integrar auth/JWT.
- La migracion queda lista para ejecutar en Supabase SQL Editor en siguiente paso.

Pendientes de acceso:
- Supabase URL + keys reales para conectar la API al proyecto.
- Acceso al proyecto Supabase para ejecutar migracion inicial.

Bloqueos:
- Ninguno tecnico local. Falta acceso para aplicar migracion en entorno real.

Siguientes pasos:
- Ejecutar migracion SQL en D1.
- Probar CRUD end-to-end contra base real.
- Implementar auth/contexto de agencia para retirar header temporal.

### Fecha: 2026-05-27
Sesion: 004
Resumen:
Se realizo pivote completo de base de datos a Cloudflare D1 y se conecto el proyecto al repositorio GitHub oficial.

Acciones ejecutadas:
- Migracion de API desde Supabase hacia D1 (queries SQL directas con binding DB).
- Creacion de migraciones D1 en apps/api/migrations/0001_initial_schema.sql.
- Configuracion de binding D1 en apps/api/wrangler.toml (pendiente colocar database_id real).
- Limpieza de dependencia @supabase/supabase-js y artefactos de carpeta supabase/.
- Actualizacion de README y checklist para stack Cloudflare-only.
- Inicializacion de git local, configuracion de remoto origin y push exitoso a main.

Decisiones tomadas:
- Stack de infraestructura definitivo para MVP: Cloudflare Pages + Workers + R2 + D1.
- Dominio y DNS siguen en fase de lanzamiento, no bloquean desarrollo.

Pendientes de acceso:
- Cloudflare: database_id real de D1 para reemplazar placeholder en wrangler.toml.
- GHL: client_id/client_secret para OAuth.

Bloqueos:
- Ninguno. El repo remoto ya esta operativo.

Siguientes pasos:
- Crear/confirmar instancia D1 nexus-re-d1 y completar database_id en wrangler.toml.
- Ejecutar migracion 0001 en D1 local y remota.
- Probar endpoints CRUD con datos reales.

### Fecha: 2026-05-27
Sesion: 005
Resumen:
Se aprovisiono D1 real en Cloudflare, se aplico la migracion inicial y se valido el runtime local del Worker con base conectada.

Acciones ejecutadas:
- Creacion de DB D1 nexus-re-d1 en cuenta Cloudflare EPIC.
- Asignacion de database_id real en apps/api/wrangler.toml.
- Ejecucion de migracion 0001 en D1 local y remoto.
- Pruebas smoke de endpoints /health, /v1/bootstrap y /v1/properties con respuesta correcta.

Decisiones tomadas:
- Se mantiene binding del Worker como env.DB para estabilidad del codigo API.

Pendientes de acceso:
- GHL: client_id/client_secret para OAuth.

Bloqueos:
- Ninguno.

Siguientes pasos:
- Sembrar datos iniciales de agencia para pruebas CRUD completas.
- Implementar CRUD de informational_agents.
- Iniciar integracion de uploads a R2.

### Fecha: 2026-05-27
Sesion: 006
Resumen:
Se completo CRUD de agentes informativos y se agrego seed inicial en D1 para pruebas con datos reales.

Acciones ejecutadas:
- Implementacion de endpoints CRUD para informational_agents en API.
- Creacion de migracion seed en apps/api/migrations/0002_seed_dev_data.sql.
- Ejecucion de seed local y remoto en D1.
- Pruebas funcionales de endpoints de agents y properties con respuestas correctas.
- Actualizacion de README y guia de migraciones para incluir seed.

Decisiones tomadas:
- Mantener seed idempotente con INSERT OR IGNORE para permitir re-ejecucion segura.

Pendientes de acceso:
- GHL: client_id/client_secret para OAuth.

Bloqueos:
- Ninguno.

Siguientes pasos:
- Implementar selector de agente en formulario de propiedad del panel.
- Crear primeras tablas restantes de modelo (property_images/property_features/property_types).
- Iniciar modulo de uploads a R2.

### Fecha: 2026-05-27
Sesion: 007
Resumen:
Se completo expansion del esquema D1 restante y se implemento el modulo inicial de media en R2 para propiedades.

Acciones ejecutadas:
- Creacion de migracion apps/api/migrations/0003_expand_mvp_schema.sql.
- Ejecucion de migracion 0003 en D1 local y remoto.
- Creacion del bucket R2 nexus-re-media.
- Configuracion de binding MEDIA_BUCKET en wrangler.toml.
- Implementacion de endpoints de imagenes de propiedad (listar, subir, marcar principal, eliminar).
- Prueba funcional de upload base64 PNG y listado de imagenes con resultado exitoso.

Decisiones tomadas:
- Estrategia de media MVP: subida via API al Worker y registro en tabla property_images.
- Se mantiene URL placeholder de media para etapa MVP inicial, pendiente dominio CDN final.

Pendientes de acceso:
- GHL: client_id/client_secret para OAuth.

Bloqueos:
- Ninguno.

Siguientes pasos:
- Integrar estos endpoints en panel web (UI de upload, orden y principal).
- Implementar ordenamiento de galeria por sort_order desde frontend.
- Avanzar con autenticacion para sustituir header x-agency-id.

### Fecha: 2026-05-27
Sesion: 008
Resumen:
Se conecto el panel web con la API para operacion real de agentes, propiedades e imagenes, y se agrego endpoint de reorder de galeria.

Acciones ejecutadas:
- Implementacion de endpoint PATCH /v1/properties/:propertyId/images/reorder.
- Reemplazo del frontend boilerplate por panel operativo MVP conectado a API local.
- UI para: crear agentes, asignar agente a propiedad, cargar imagenes, marcar principal, eliminar y reordenar.
- Validacion de compilacion web + API sin errores.
- Smoke tests de reorder con respuesta esperada para caso invalido y caso exitoso.

Decisiones tomadas:
- Se usa por ahora header x-agency-id fijo de demo en frontend local hasta integrar auth.
- Reordenamiento de galeria en UI actual se hace con controles subir/bajar; drag/drop queda pendiente.

Pendientes de acceso:
- GHL: client_id/client_secret para OAuth.

Bloqueos:
- Ninguno.

Siguientes pasos:
- Implementar drag/drop real para galeria.
- Consumir el panel desde entorno desplegado en Pages/Workers.

### Fecha: 2026-05-28
Sesion: 009
Resumen:
Se completo refinamiento clave de la pantalla Nueva Propiedad (UI/UX y validaciones de publicacion) y se publico una nueva version en Cloudflare Pages.

Acciones ejecutadas:
- Implementacion de boton "Vista previa" con modal de resumen de datos.
- Validacion dura de publicacion en frontend: requiere titulo, precios segun tipo de oferta y minimo una imagen.
- Mejora de multimedia: selector de archivos real, previsualizacion de imagenes cargadas y eliminacion individual.
- Rediseño del bloque Amenidades con buscador, lista con scroll (viewport fijo), y creador de amenidades personalizadas con selector de icono + nombre.
- Implementacion de bloque "Formulario" con checkbox de habilitacion y area para HTML personalizado.
- Recalculo de score de listing por secciones para alcanzar 100% cuando todo esta completo.
- Build local exitoso y deploy Pages exitoso en: https://e9958b48.nexus-re-web.pages.dev

Decisiones tomadas:
- La publicacion queda bloqueada en UI si faltan campos criticos; la persistencia real queda para siguiente paso de integracion backend.
- El score se evalua por bloques funcionales de la ficha para reflejar completitud real del formulario.

Pendientes de acceso:
- GHL: client_id/client_secret para OAuth.

Bloqueos:
- Ninguno.

Siguientes pasos:
- Conectar el submit de Nueva Propiedad con endpoint real de creacion/guardado.
- Reemplazar previsualizacion local de imagenes por flujo definitivo con upload a R2 en esta pantalla.

### Fecha: 2026-05-27
Sesion: 010
Resumen:
Se ajusto nuevamente la pantalla Nueva Propiedad para agregar ubicacion estructurada de Guatemala, precios en Quetzales, buscador estilizado, selector visual de iconos de amenidades y borrado de etiquetas con icono.

Acciones ejecutadas:
- Agregados selectores de Departamento y Municipio con lista de departamentos de Guatemala.
- Agregado campo de direccion en texto plano antes del mapa.
- Cambiados labels de precios a Quetzales para venta y renta.
- Redisenado el buscador de amenidades con estilo propio e icono visible.
- Reemplazado el dropdown de icono por un selector visual de iconos para amenidades.
- Sustituido el texto "close" en etiquetas por un icono de borrado.
- Eliminado el bloque de puntuacion del listado.
- Rebuild y redeploy exitosos en Cloudflare Pages.

Decisiones tomadas:
- La ubicacion se modela como departamento + municipio + direccion libre para facilitar persistencia posterior.
- Los precios se muestran en Q para alinearse con el mercado local de Guatemala.

Pendientes de acceso:
- GHL: client_id/client_secret para OAuth.

Bloqueos:
- Ninguno.

Siguientes pasos:
- Conectar persistencia real de la nueva propiedad al backend.
- Validar que el endpoint reciba los nuevos campos de ubicacion y precios en Quetzales.

### Fecha: 2026-05-27
Sesion: 009
Resumen:
Se estabilizo la navegacion del dashboard de agencia y se implemento la nueva pantalla de Gestion de Propiedades basada en la plantilla stitch_nexus_re_propertyManagement, manteniendo toda la interfaz en espanol.

Acciones ejecutadas:
- Correccion de CSS y TypeScript para recuperar build verde del frontend.
- Ajuste del sidebar de agencia para icono de Propiedades con edificio (home_work).
- Separacion real de vistas del panel de agencia:
	- Dashboard (resumen)
	- Gestion de Propiedades (tabla/filtros/acciones)
- Implementacion de filtros visuales y tabla expandida en Gestion de Propiedades.
- Validacion manual en navegador de click en menu:
	- Dashboard muestra resumen.
	- Propiedades muestra Gestion de Propiedades.
- Deploy publicado en Cloudflare Pages.

Decisiones tomadas:
- Mantener React + CSS existente y usar la plantilla como referencia de estructura/estilo (no migrar framework).
- Preservar Super Admin como entrada principal y usar hash #agency-demo para flujo de agencia.

Pendientes de acceso:
- GHL: client_id/client_secret para OAuth.

Bloqueos:
- Ninguno activo.

Siguientes pasos:
- Ajuste fino visual 1:1 de Gestion de Propiedades (espaciados, estados, paginacion).
- Conectar filtros UI a filtrado real de datos (estado/tipo/agente).
- Definir comportamiento funcional de acciones por fila (editar/ver/mas).

### Fecha: 2026-05-27
Sesion: 010
Resumen:
Se migro la navegacion del frontend desde hash interno a rutas reales con React Router, separando Super Admin y pantallas de agencia en paginas independientes.

Acciones ejecutadas:
- Instalacion de react-router-dom en apps/web.
- Refactor de App principal para declarar rutas:
	- / (Super Admin)
	- /agency/ (Dashboard de agencia)
	- /agency/propiedades/ (Gestion de propiedades)
- Separacion de pantallas y componentes en archivos dedicados:
	- pages/SuperAdminPage.tsx
	- pages/AgencyDashboardPage.tsx
	- pages/AgencyPropertiesPage.tsx
	- components/AgencyLayout.tsx
- Extraccion de logica compartida de agencia a hook y utilidades:
	- hooks/useAgencyData.ts
	- lib/types.ts
	- lib/formatters.ts
- Validacion funcional en deploy de Pages: rutas directas y navegacion lateral entre /agency/ y /agency/propiedades/.

Decisiones tomadas:
- Mantener el CSS visual existente para evitar regresiones de estilo y concentrar cambios en arquitectura de navegacion.
- Compartir layout y carga de datos de agencia entre paginas para consistencia visual/funcional.

Bloqueos:
- Ninguno activo.

Siguientes pasos:
- Revisar reglas/redirects de Pages para que el alias principal propague la nueva version sin cache residual.
- Conectar acciones de tabla y filtros a comportamientos reales de negocio.

### Fecha: 2026-05-27
Sesion: 011
Resumen:
Ajuste puntual de UX en Dashboard y detalle de copy en header de Gestion de Propiedades.

Acciones ejecutadas:
- Se agrego accion adicional tipo "mundito" (icono language) en la tabla de actividad reciente del Dashboard para "Ver propiedad".
- Se mantuvo accion de visibility como "Vista previa" para diferenciar funciones.
- Se corrigio copy del header en Gestion de Propiedades para mostrar singular/plural correcto:
	- 1 propiedad
	- N propiedades

Bloqueos:
- Validacion de build/deploy por terminal con salida intermitente no concluyente en esta corrida.

Siguientes pasos:
- Publicar nuevamente cuando el build en terminal responda normal y validar en alias principal.

### Fecha: 2026-05-27
Sesion: 012
Resumen:
Se corrigio la diferencia visual del header entre Dashboard y Gestion de Propiedades en agencia.

Acciones ejecutadas:
- Se identifico causa raiz en CSS: `main-panel` heredaba `display: grid` por reglas duplicadas y estiraba filas de forma inconsistente segun contenido.
- Se forzo layout estable para `main-panel` con `display: flex` + `flex-direction: column`.
- Se fijo `topbar` como bloque no estirable (`flex: 0 0 auto`).
- Se mantuvo el contenido de ambas vistas (`agency-dashboard-overview` y `property-management-view`) como bloque principal (`flex: 1 0 auto`).
- Build y deploy exitoso en Pages.

Resultado:
- Header superior (busqueda + iconos + avatar) queda con altura consistente entre:
	- /agency/
	- /agency/propiedades/

### Fecha: 2026-05-27
Sesion: 013
Resumen:
Se implemento la nueva pantalla "Nueva Propiedad" con ruta separada y base de campos alineada a datos de backend.

Acciones ejecutadas:
- Nueva ruta en panel de agencia:
	- /agency/nueva-propiedad/
- Nueva pantalla React basada en template stitch_nexus_re_crear_propiedad:
	- Header de accion (guardar/publicar)
	- Informacion principal (titulo, descripcion, tags)
	- Tipo de oferta y precios (venta/renta/ambos)
	- Multimedia (dropzone UI)
	- Ubicacion (maps url, latitud, longitud)
	- Amenidades (checklist)
	- Score de completitud de listado
- Se agrego modelo tipado para base de datos/formulario:
	- NewPropertyDraft
	- PropertyOfferType
- Navegacion conectada a nueva ruta desde:
	- Boton "+ Agregar propiedad" en Dashboard
	- Boton "+ Nueva propiedad" en Gestion de Propiedades
	- CTA lateral "Agregar Propiedad"
- Deploy publicado con API base de produccion.

Deploy validado:
- https://88f80481.nexus-re-web.pages.dev

Pendiente funcional siguiente:
- Conectar submit de formulario a endpoint real de creacion de propiedades.
- Iniciar autenticacion y contexto de agencia real.

### Fecha: 2026-05-27
Sesion: 009
Resumen:
Se completo drag/drop real en galeria del panel web, conectado al endpoint de reorder existente.

Acciones ejecutadas:
- Implementacion de manejo drag start/over/drop/end en cards de imagenes.
- Integracion de reorder desde frontend contra PATCH /v1/properties/:propertyId/images/reorder.
- Estilos visuales para estado dragging y drag-over.
- Validacion de compilacion web y typecheck API.

Decisiones tomadas:
- Se mantienen botones subir/bajar como fallback adicional mientras el drag/drop se estabiliza.

Pendientes de acceso:
- GHL: client_id/client_secret para OAuth.

Bloqueos:
- Ninguno.

Siguientes pasos:
- Desplegar panel y API en Cloudflare para pruebas fuera de localhost.
- Iniciar autenticacion y contexto de agencia en frontend/backend.

### Fecha: 2026-05-27
Sesion: 010
Resumen:
Se definio iniciar proceso de despliegue para revisar GUI en entorno publicado y trabajar ajustes iterativos de paginas.

Acciones ejecutadas:
- Actualizacion de checklist para priorizar despliegue inicial (Pages + Worker) y validacion E2E en entorno publicado.
- Registro de estrategia de super admin temporal para QA de interfaz.

Decisiones tomadas:
- Se usara un super admin temporal para ajuste visual y pruebas de flujo en GUI.
- Las credenciales no se guardan en archivos versionados; se manejan como secretos de entorno.

Pendientes de acceso:
- GHL: client_id/client_secret para OAuth.

Bloqueos:
- Ninguno.

Siguientes pasos:
- Mostrar estado actual de lo construido en web/API para definir ajustes de interfaz.
- Ejecutar despliegue inicial a Cloudflare Pages y Worker.

### Fecha: 2026-05-27
Sesion: 011
Resumen:
Se completo despliegue inicial de API y frontend en Cloudflare para comenzar revision visual del GUI.

Acciones ejecutadas:
- Deploy API Worker exitoso: https://nexus-re-api.epicgt.workers.dev
- Deploy Pages exitoso: https://f5ccb045.nexus-re-web.pages.dev
- Configuracion de CORS en API para consumo cross-origin desde frontend.
- Frontend ajustado para usar VITE_API_BASE_URL en build de despliegue.
- Verificacion API remota en /health y /v1/bootstrap.

Decisiones tomadas:
- Se mantiene super admin temporal para QA de interfaz; credenciales se manejaran fuera del repositorio como secreto operativo.

Pendientes de acceso:
- GHL: client_id/client_secret para OAuth.

Bloqueos:
- Ninguno critico. Verificacion con curl al dominio Pages fallo por TLS local, pero deployment aparece exitoso en wrangler pages deployment list.

Siguientes pasos:
- Validar GUI directamente en navegador sobre URL Pages desplegada.
- Probar CRUD basico end-to-end desde entorno desplegado.
- Continuar ajustes visuales por pantalla segun feedback.

### Fecha: 2026-05-27
Sesion: 012
Resumen:
Se implemento la primera pantalla del panel Super Admin (Agencies Overview) inspirada en el prototipo stitch_nexus_re y se publico para revision.

Acciones ejecutadas:
- Integracion de logos desde gui_resources/gfx en el frontend.
- Reemplazo de la vista actual por pantalla Super Admin tipo Agencies Overview.
- Implementacion de layout: topbar, buscador, tabs, hero, tabla de agencias, estado, acciones y paginacion visual.
- Estilo visual dark glassmorphism basado en DESIGN.md del prototipo.
- Build frontend exitoso y deploy en Pages para revision.

Decisiones tomadas:
- Esta primera pantalla usa datos mock para calibrar GUI de super admin antes de conectar funcionalidades completas.

Pendientes de acceso:
- GHL: client_id/client_secret para OAuth.

Bloqueos:
- Ninguno.

Siguientes pasos:
- Recibir feedback visual y ajustar detalle de la pantalla Super Admin.
- Conectar acciones del grid de agencias con endpoints reales en siguiente iteracion.

### Fecha: 2026-05-27
Sesion: 013
Resumen:
Se implemento el panel de Agencia/Sub-cuenta usando la plantilla stitch_real_estate_homepage_concept_1, enfocado en Dashboard + Properties + Settings (sin Leads), junto con backend base para metricas y settings.

Acciones ejecutadas:
- Nuevo frontend de panel de agencia en apps/web con layout tipo dashboard (sidebar, cards KPI, tabla de propiedades, buscador).
- Integracion frontend con API real usando x-agency-id demo para cargar metricas, propiedades y settings.
- Implementacion de endpoint GET /v1/agency/dashboard para KPIs de sub-cuenta.
- Implementacion de endpoints GET/PATCH /v1/agency/settings para configuraciones de portal por agencia.
- Correccion de error JSX de cierre en App.tsx y validacion TypeScript.
- Deploy de API en Worker nexus-re-api y deploy de frontend en Pages.
- Limpieza de despliegues viejos en Pages para evitar confusion (se dejaron solo los activos recientes).

Decisiones tomadas:
- La pantalla Add New Agency queda en pausa hasta definir flujo exacto de GHL OAuth/sub-cuenta.
- Se adopta el lenguaje visual del Super Admin como base para el resto de vistas.

Pendientes de acceso:
- GHL: client_id/client_secret para OAuth.

Bloqueos:
- Ninguno.

Siguientes pasos:
- Conectar botones Edit/View/Add Property a formularios reales.
- Implementar UI de configuraciones de sub-cuenta sobre /v1/agency/settings.
- Definir y ejecutar flujo real de alta de sub-cuenta cuando se confirme proceso GHL.
