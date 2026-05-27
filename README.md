# NEXUS RE

Plataforma SaaS inmobiliaria multi-tenant enfocada en:
- gestion de propiedades
- portal inmobiliario
- listings y buscador
- templates y branding por agencia
- integracion visual con GoHighLevel (GHL)

No incluye CRM interno en MVP. Los leads viven en GHL.

## Stack inicial
- Frontend: React + Vite + TypeScript (apps/web)
- API: Cloudflare Worker + Hono + TypeScript (apps/api)
- Shared: tipos/esquemas compartidos (packages/shared)
- Infra objetivo: Cloudflare Pages + Workers + R2
- DB objetivo: Cloudflare D1

## Estructura
- apps/web: portal/panel frontend
- apps/api: API backend en Worker
- packages/shared: tipos y validaciones compartidas
- AI_AGENT_MEMORY.md: bitacora operativa para agentes IA
- PHASE_CHECKLIST.md: checklist por fases y subtareas

## Requisitos locales
- Node.js 22+
- npm 10+

## Arranque local
1. Instalar dependencias desde la raiz:

```bash
npm install
```

2. Ejecutar frontend:

```bash
npm run dev:web
```

3. Ejecutar API (Worker local):

```bash
npm run dev:api
```

4. Crear archivo local para variables del Worker:

```bash
cp .env.example apps/api/.dev.vars
```

Editar `apps/api/.dev.vars` con valores reales de Cloudflare y GHL.

## Base de datos (slice inicial)
- SQL inicial: `apps/api/migrations/0001_initial_schema.sql`
- Seed inicial: `apps/api/migrations/0002_seed_dev_data.sql`
- Expansion de esquema: `apps/api/migrations/0003_expand_mvp_schema.sql`
- Guia: `apps/api/migrations/README.md`

## Variables de entorno
Usar .env.example como base. Campos actuales:
- CLOUDFLARE_ACCOUNT_ID
- CLOUDFLARE_API_TOKEN
- R2_BUCKET_MEDIA
- CLOUDFLARE_D1_DATABASE_ID
- CLOUDFLARE_D1_DATABASE_NAME
- GHL_CLIENT_ID
- GHL_CLIENT_SECRET
- GHL_REDIRECT_URI

## Endpoints iniciales API
- GET /health
- GET /v1/bootstrap
- GET /v1/validate/listing-type/:value
- GET /v1/properties
- GET /v1/properties/:id
- POST /v1/properties
- PATCH /v1/properties/:id
- DELETE /v1/properties/:id
- GET /v1/informational-agents
- GET /v1/informational-agents/:id
- POST /v1/informational-agents
- PATCH /v1/informational-agents/:id
- DELETE /v1/informational-agents/:id
- GET /v1/properties/:id/images
- POST /v1/properties/:id/images
- PATCH /v1/properties/:propertyId/images/:imageId/primary
- DELETE /v1/properties/:propertyId/images/:imageId

Todos los endpoints de propiedades requieren header `x-agency-id` con UUID valido.

## Proximo slice sugerido
1. Implementar auth + contexto de agency para reemplazar header temporal `x-agency-id`.
2. Agregar CRUD de informational_agents.
3. Iniciar carga de imagenes a R2 y relacionarlas con propiedades.
