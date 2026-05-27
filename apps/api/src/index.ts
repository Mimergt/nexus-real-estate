import { Hono } from 'hono'
import { z } from 'zod'
import { listingTypeSchema } from '@nexus-re/shared'

type Bindings = {
  DB?: D1Database
  GHL_CLIENT_ID?: string
}

const agencyHeader = 'x-agency-id'

const agencyIdSchema = z.uuid()

const propertySchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  listing_type: listingTypeSchema,
  property_type: z.string().min(1),
  status: z.string().min(1),
  currency: z.string().min(1),
  price: z.number().nonnegative(),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
  parking_spaces: z.number().int().nonnegative(),
  size_m2: z.number().nonnegative(),
  address: z.string().min(1),
  city: z.string().min(1),
  zone: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  featured: z.boolean(),
  published: z.boolean(),
  maintenance_fee: z.number().nonnegative().nullable().optional(),
  year_built: z.number().int().nullable().optional(),
  video_url: z.url().nullable().optional(),
  virtual_tour_url: z.url().nullable().optional(),
  agent_id: z.uuid().nullable().optional(),
})

const propertyPatchSchema = propertySchema.partial()

const informationalAgentSchema = z.object({
  name: z.string().min(1),
  phone: z.string().nullable().optional(),
  email: z.email().nullable().optional(),
  photo: z.url().nullable().optional(),
  bio: z.string().nullable().optional(),
})

const informationalAgentPatchSchema = informationalAgentSchema.partial()

const parseAgencyId = (value: string | undefined) => {
  const parsed = agencyIdSchema.safeParse(value)
  return parsed.success ? parsed.data : null
}

const toDbBoolean = (value: boolean) => (value ? 1 : 0)
const fromDbBoolean = (value: unknown) => Number(value) === 1

type PropertyRow = {
  id: string
  agency_id: string
  agent_id: string | null
  title: string
  slug: string
  description: string
  listing_type: string
  property_type: string
  status: string
  currency: string
  price: number
  bedrooms: number
  bathrooms: number
  parking_spaces: number
  size_m2: number
  address: string
  city: string
  zone: string
  latitude: number
  longitude: number
  featured: number
  published: number
  maintenance_fee: number | null
  year_built: number | null
  video_url: string | null
  virtual_tour_url: string | null
  created_at: string
  updated_at: string
}

type InformationalAgentRow = {
  id: string
  agency_id: string
  name: string
  phone: string | null
  email: string | null
  photo: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

const mapPropertyRow = (row: PropertyRow) => ({
  ...row,
  featured: fromDbBoolean(row.featured),
  published: fromDbBoolean(row.published),
})

const getDb = (env: Bindings) => env.DB

const app = new Hono<{ Bindings: Bindings }>()

app.get('/health', (c) => {
  return c.json({ ok: true, service: 'nexus-re-api' })
})

app.get('/v1/bootstrap', (c) => {
  const hasD1 = Boolean(c.env.DB)
  const hasGhl = Boolean(c.env.GHL_CLIENT_ID)

  return c.json({
    ok: true,
    mvp_scope: 'properties_portal_only',
    integrations: {
      d1_configured: hasD1,
      ghl_oauth_configured: hasGhl,
    },
  })
})

app.get('/v1/validate/listing-type/:value', (c) => {
  const value = c.req.param('value')
  const parsed = z.object({ value: listingTypeSchema }).safeParse({ value })

  if (!parsed.success) {
    return c.json({ ok: false, error: 'invalid_listing_type' }, 400)
  }

  return c.json({ ok: true, value: parsed.data.value })
})

app.get('/v1/properties', async (c) => {
  const agencyId = parseAgencyId(c.req.header(agencyHeader))

  if (!agencyId) {
    return c.json({ ok: false, error: 'missing_or_invalid_agency_id_header' }, 400)
  }

  const db = getDb(c.env)

  if (!db) {
    return c.json({ ok: false, error: 'd1_not_configured' }, 500)
  }

  const { results } = await db
    .prepare('select * from properties where agency_id = ? order by created_at desc')
    .bind(agencyId)
    .all<PropertyRow>()

  return c.json({ ok: true, items: (results ?? []).map(mapPropertyRow) })
})

app.get('/v1/properties/:id', async (c) => {
  const agencyId = parseAgencyId(c.req.header(agencyHeader))
  const propertyId = c.req.param('id')

  if (!agencyId) {
    return c.json({ ok: false, error: 'missing_or_invalid_agency_id_header' }, 400)
  }

  if (!agencyIdSchema.safeParse(propertyId).success) {
    return c.json({ ok: false, error: 'invalid_property_id' }, 400)
  }

  const db = getDb(c.env)

  if (!db) {
    return c.json({ ok: false, error: 'd1_not_configured' }, 500)
  }

  const data = await db
    .prepare('select * from properties where id = ? and agency_id = ? limit 1')
    .bind(propertyId, agencyId)
    .first<PropertyRow>()

  if (!data) {
    return c.json({ ok: false, error: 'property_not_found' }, 404)
  }

  return c.json({ ok: true, item: mapPropertyRow(data) })
})

app.post('/v1/properties', async (c) => {
  const agencyId = parseAgencyId(c.req.header(agencyHeader))

  if (!agencyId) {
    return c.json({ ok: false, error: 'missing_or_invalid_agency_id_header' }, 400)
  }

  const body = await c.req.json()
  const parsedBody = propertySchema.safeParse(body)

  if (!parsedBody.success) {
    return c.json({ ok: false, error: 'invalid_payload', details: parsedBody.error.flatten() }, 400)
  }

  const db = getDb(c.env)

  if (!db) {
    return c.json({ ok: false, error: 'd1_not_configured' }, 500)
  }

  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  const payload = {
    id,
    ...parsedBody.data,
    agency_id: agencyId,
    featured: toDbBoolean(parsedBody.data.featured),
    published: toDbBoolean(parsedBody.data.published),
    created_at: now,
    updated_at: now,
  }

  await db
    .prepare(
      `insert into properties (
        id, agency_id, agent_id, title, slug, description, listing_type, property_type, status,
        currency, price, bedrooms, bathrooms, parking_spaces, size_m2, address, city, zone,
        latitude, longitude, featured, published, maintenance_fee, year_built, video_url,
        virtual_tour_url, created_at, updated_at
      ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      payload.id,
      payload.agency_id,
      payload.agent_id ?? null,
      payload.title,
      payload.slug,
      payload.description,
      payload.listing_type,
      payload.property_type,
      payload.status,
      payload.currency,
      payload.price,
      payload.bedrooms,
      payload.bathrooms,
      payload.parking_spaces,
      payload.size_m2,
      payload.address,
      payload.city,
      payload.zone,
      payload.latitude,
      payload.longitude,
      payload.featured,
      payload.published,
      payload.maintenance_fee ?? null,
      payload.year_built ?? null,
      payload.video_url ?? null,
      payload.virtual_tour_url ?? null,
      payload.created_at,
      payload.updated_at
    )
    .run()

  const inserted = await db.prepare('select * from properties where id = ? limit 1').bind(id).first<PropertyRow>()

  return c.json({ ok: true, item: inserted ? mapPropertyRow(inserted) : null }, 201)
})

app.patch('/v1/properties/:id', async (c) => {
  const agencyId = parseAgencyId(c.req.header(agencyHeader))
  const propertyId = c.req.param('id')

  if (!agencyId) {
    return c.json({ ok: false, error: 'missing_or_invalid_agency_id_header' }, 400)
  }

  if (!agencyIdSchema.safeParse(propertyId).success) {
    return c.json({ ok: false, error: 'invalid_property_id' }, 400)
  }

  const body = await c.req.json()
  const parsedBody = propertyPatchSchema.safeParse(body)

  if (!parsedBody.success) {
    return c.json({ ok: false, error: 'invalid_payload', details: parsedBody.error.flatten() }, 400)
  }

  const db = getDb(c.env)

  if (!db) {
    return c.json({ ok: false, error: 'd1_not_configured' }, 500)
  }

  const current = await db
    .prepare('select * from properties where id = ? and agency_id = ? limit 1')
    .bind(propertyId, agencyId)
    .first<PropertyRow>()

  if (!current) {
    return c.json({ ok: false, error: 'property_not_found' }, 404)
  }

  const next = {
    ...current,
    ...parsedBody.data,
    agency_id: current.agency_id,
    id: current.id,
    featured:
      typeof parsedBody.data.featured === 'boolean' ? toDbBoolean(parsedBody.data.featured) : current.featured,
    published:
      typeof parsedBody.data.published === 'boolean' ? toDbBoolean(parsedBody.data.published) : current.published,
    updated_at: new Date().toISOString(),
  }

  await db
    .prepare(
      `update properties set
        agent_id = ?, title = ?, slug = ?, description = ?, listing_type = ?, property_type = ?,
        status = ?, currency = ?, price = ?, bedrooms = ?, bathrooms = ?, parking_spaces = ?,
        size_m2 = ?, address = ?, city = ?, zone = ?, latitude = ?, longitude = ?, featured = ?,
        published = ?, maintenance_fee = ?, year_built = ?, video_url = ?, virtual_tour_url = ?,
        updated_at = ?
      where id = ? and agency_id = ?`
    )
    .bind(
      next.agent_id ?? null,
      next.title,
      next.slug,
      next.description,
      next.listing_type,
      next.property_type,
      next.status,
      next.currency,
      next.price,
      next.bedrooms,
      next.bathrooms,
      next.parking_spaces,
      next.size_m2,
      next.address,
      next.city,
      next.zone,
      next.latitude,
      next.longitude,
      next.featured,
      next.published,
      next.maintenance_fee ?? null,
      next.year_built ?? null,
      next.video_url ?? null,
      next.virtual_tour_url ?? null,
      next.updated_at,
      propertyId,
      agencyId
    )
    .run()

  const updated = await db
    .prepare('select * from properties where id = ? and agency_id = ? limit 1')
    .bind(propertyId, agencyId)
    .first<PropertyRow>()

  return c.json({ ok: true, item: updated ? mapPropertyRow(updated) : null })
})

app.delete('/v1/properties/:id', async (c) => {
  const agencyId = parseAgencyId(c.req.header(agencyHeader))
  const propertyId = c.req.param('id')

  if (!agencyId) {
    return c.json({ ok: false, error: 'missing_or_invalid_agency_id_header' }, 400)
  }

  if (!agencyIdSchema.safeParse(propertyId).success) {
    return c.json({ ok: false, error: 'invalid_property_id' }, 400)
  }

  const db = getDb(c.env)

  if (!db) {
    return c.json({ ok: false, error: 'd1_not_configured' }, 500)
  }

  const found = await db
    .prepare('select id from properties where id = ? and agency_id = ? limit 1')
    .bind(propertyId, agencyId)
    .first<{ id: string }>()

  if (!found) {
    return c.json({ ok: false, error: 'property_not_found' }, 404)
  }

  await db.prepare('delete from properties where id = ? and agency_id = ?').bind(propertyId, agencyId).run()

  return c.json({ ok: true, deleted_id: found.id })
})

app.get('/v1/informational-agents', async (c) => {
  const agencyId = parseAgencyId(c.req.header(agencyHeader))

  if (!agencyId) {
    return c.json({ ok: false, error: 'missing_or_invalid_agency_id_header' }, 400)
  }

  const db = getDb(c.env)

  if (!db) {
    return c.json({ ok: false, error: 'd1_not_configured' }, 500)
  }

  const { results } = await db
    .prepare('select * from informational_agents where agency_id = ? order by created_at desc')
    .bind(agencyId)
    .all<InformationalAgentRow>()

  return c.json({ ok: true, items: results ?? [] })
})

app.get('/v1/informational-agents/:id', async (c) => {
  const agencyId = parseAgencyId(c.req.header(agencyHeader))
  const informationalAgentId = c.req.param('id')

  if (!agencyId) {
    return c.json({ ok: false, error: 'missing_or_invalid_agency_id_header' }, 400)
  }

  if (!agencyIdSchema.safeParse(informationalAgentId).success) {
    return c.json({ ok: false, error: 'invalid_informational_agent_id' }, 400)
  }

  const db = getDb(c.env)

  if (!db) {
    return c.json({ ok: false, error: 'd1_not_configured' }, 500)
  }

  const item = await db
    .prepare('select * from informational_agents where id = ? and agency_id = ? limit 1')
    .bind(informationalAgentId, agencyId)
    .first<InformationalAgentRow>()

  if (!item) {
    return c.json({ ok: false, error: 'informational_agent_not_found' }, 404)
  }

  return c.json({ ok: true, item })
})

app.post('/v1/informational-agents', async (c) => {
  const agencyId = parseAgencyId(c.req.header(agencyHeader))

  if (!agencyId) {
    return c.json({ ok: false, error: 'missing_or_invalid_agency_id_header' }, 400)
  }

  const body = await c.req.json()
  const parsedBody = informationalAgentSchema.safeParse(body)

  if (!parsedBody.success) {
    return c.json({ ok: false, error: 'invalid_payload', details: parsedBody.error.flatten() }, 400)
  }

  const db = getDb(c.env)

  if (!db) {
    return c.json({ ok: false, error: 'd1_not_configured' }, 500)
  }

  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  await db
    .prepare(
      `insert into informational_agents (
        id, agency_id, name, phone, email, photo, bio, created_at, updated_at
      ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      agencyId,
      parsedBody.data.name,
      parsedBody.data.phone ?? null,
      parsedBody.data.email ?? null,
      parsedBody.data.photo ?? null,
      parsedBody.data.bio ?? null,
      now,
      now
    )
    .run()

  const inserted = await db.prepare('select * from informational_agents where id = ? limit 1').bind(id).first()

  return c.json({ ok: true, item: inserted ?? null }, 201)
})

app.patch('/v1/informational-agents/:id', async (c) => {
  const agencyId = parseAgencyId(c.req.header(agencyHeader))
  const informationalAgentId = c.req.param('id')

  if (!agencyId) {
    return c.json({ ok: false, error: 'missing_or_invalid_agency_id_header' }, 400)
  }

  if (!agencyIdSchema.safeParse(informationalAgentId).success) {
    return c.json({ ok: false, error: 'invalid_informational_agent_id' }, 400)
  }

  const body = await c.req.json()
  const parsedBody = informationalAgentPatchSchema.safeParse(body)

  if (!parsedBody.success) {
    return c.json({ ok: false, error: 'invalid_payload', details: parsedBody.error.flatten() }, 400)
  }

  const db = getDb(c.env)

  if (!db) {
    return c.json({ ok: false, error: 'd1_not_configured' }, 500)
  }

  const current = await db
    .prepare('select * from informational_agents where id = ? and agency_id = ? limit 1')
    .bind(informationalAgentId, agencyId)
    .first<InformationalAgentRow>()

  if (!current) {
    return c.json({ ok: false, error: 'informational_agent_not_found' }, 404)
  }

  const next = {
    ...current,
    ...parsedBody.data,
    agency_id: current.agency_id,
    id: current.id,
    updated_at: new Date().toISOString(),
  }

  await db
    .prepare(
      `update informational_agents set
        name = ?, phone = ?, email = ?, photo = ?, bio = ?, updated_at = ?
      where id = ? and agency_id = ?`
    )
    .bind(
      next.name,
      next.phone ?? null,
      next.email ?? null,
      next.photo ?? null,
      next.bio ?? null,
      next.updated_at,
      informationalAgentId,
      agencyId
    )
    .run()

  const updated = await db
    .prepare('select * from informational_agents where id = ? and agency_id = ? limit 1')
    .bind(informationalAgentId, agencyId)
    .first<InformationalAgentRow>()

  return c.json({ ok: true, item: updated ?? null })
})

app.delete('/v1/informational-agents/:id', async (c) => {
  const agencyId = parseAgencyId(c.req.header(agencyHeader))
  const informationalAgentId = c.req.param('id')

  if (!agencyId) {
    return c.json({ ok: false, error: 'missing_or_invalid_agency_id_header' }, 400)
  }

  if (!agencyIdSchema.safeParse(informationalAgentId).success) {
    return c.json({ ok: false, error: 'invalid_informational_agent_id' }, 400)
  }

  const db = getDb(c.env)

  if (!db) {
    return c.json({ ok: false, error: 'd1_not_configured' }, 500)
  }

  const found = await db
    .prepare('select id from informational_agents where id = ? and agency_id = ? limit 1')
    .bind(informationalAgentId, agencyId)
    .first<{ id: string }>()

  if (!found) {
    return c.json({ ok: false, error: 'informational_agent_not_found' }, 404)
  }

  await db
    .prepare('delete from informational_agents where id = ? and agency_id = ?')
    .bind(informationalAgentId, agencyId)
    .run()

  return c.json({ ok: true, deleted_id: found.id })
})

export default app
