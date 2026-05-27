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
