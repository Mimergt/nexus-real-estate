import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { z } from 'zod'
import { listingTypeSchema } from '@nexus-re/shared'

type Bindings = {
  DB?: D1Database
  MEDIA_BUCKET?: R2Bucket
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

const propertyImageUploadSchema = z.object({
  filename: z.string().min(1),
  content_type: z.string().min(1),
  data_base64: z.string().min(1),
  is_primary: z.boolean().optional().default(false),
})

const propertyImageReorderSchema = z.object({
  image_ids: z.array(z.uuid()).min(1),
})

const websiteSettingsPatchSchema = z.object({
  logo_url: z.string().nullable().optional(),
  primary_color: z.string().nullable().optional(),
  secondary_color: z.string().nullable().optional(),
  fonts: z.string().nullable().optional(),
  hero_style: z.string().nullable().optional(),
  layout_style: z.string().nullable().optional(),
  default_chat_widget: z.string().nullable().optional(),
  default_form_embed: z.string().nullable().optional(),
  default_calendar_embed: z.string().nullable().optional(),
})

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

type PropertyImageRow = {
  id: string
  property_id: string
  agency_id: string
  object_key: string
  image_url: string
  content_type: string | null
  file_size_bytes: number | null
  is_primary: number
  sort_order: number
  created_at: string
  updated_at: string
}

type WebsiteSettingsRow = {
  id: string
  agency_id: string
  logo_url: string | null
  primary_color: string | null
  secondary_color: string | null
  fonts: string | null
  hero_style: string | null
  layout_style: string | null
  default_chat_widget: string | null
  default_form_embed: string | null
  default_calendar_embed: string | null
  created_at: string
  updated_at: string
}

type AgencyDashboardMetricsRow = {
  total_properties: number | string | null
  active_properties: number | string | null
  featured_properties: number | string | null
  published_properties: number | string | null
  portfolio_value: number | string | null
}

type RecentPropertiesCountRow = {
  recent_properties: number | string | null
}

const mapPropertyRow = (row: PropertyRow) => ({
  ...row,
  featured: fromDbBoolean(row.featured),
  published: fromDbBoolean(row.published),
})

const mapPropertyImageRow = (row: PropertyImageRow) => ({
  ...row,
  is_primary: fromDbBoolean(row.is_primary),
})

const getDb = (env: Bindings) => env.DB

const getMediaBucket = (env: Bindings) => env.MEDIA_BUCKET

const decodeBase64 = (encoded: string) => {
  const normalized = encoded.includes(',') ? encoded.split(',').pop() ?? '' : encoded
  const binary = atob(normalized)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes
}

const sanitizeFilename = (filename: string) => filename.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()

const app = new Hono<{ Bindings: Bindings }>()

app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'x-agency-id'],
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
)

app.get('/health', (c) => {
  return c.json({ ok: true, service: 'nexus-re-api' })
})

app.get('/v1/bootstrap', (c) => {
  const hasD1 = Boolean(c.env.DB)
  const hasR2 = Boolean(c.env.MEDIA_BUCKET)
  const hasGhl = Boolean(c.env.GHL_CLIENT_ID)

  return c.json({
    ok: true,
    mvp_scope: 'properties_portal_only',
    integrations: {
      d1_configured: hasD1,
      r2_configured: hasR2,
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

app.get('/v1/agency/dashboard', async (c) => {
  const agencyId = parseAgencyId(c.req.header(agencyHeader))

  if (!agencyId) {
    return c.json({ ok: false, error: 'missing_or_invalid_agency_id_header' }, 400)
  }

  const db = getDb(c.env)

  if (!db) {
    return c.json({ ok: false, error: 'd1_not_configured' }, 500)
  }

  const metrics = await db
    .prepare(
      `select
        count(*) as total_properties,
        sum(case when lower(status) in ('active', 'disponible', 'published') then 1 else 0 end) as active_properties,
        sum(case when featured = 1 then 1 else 0 end) as featured_properties,
        sum(case when published = 1 then 1 else 0 end) as published_properties,
        coalesce(sum(price), 0) as portfolio_value
      from properties
      where agency_id = ?`
    )
    .bind(agencyId)
    .first<AgencyDashboardMetricsRow>()

  const recent = await db
    .prepare(
      `select count(*) as recent_properties
      from properties
      where agency_id = ?
      and datetime(created_at) >= datetime('now', '-30 day')`
    )
    .bind(agencyId)
    .first<RecentPropertiesCountRow>()

  return c.json({
    ok: true,
    item: {
      total_properties: Number(metrics?.total_properties ?? 0),
      active_properties: Number(metrics?.active_properties ?? 0),
      featured_properties: Number(metrics?.featured_properties ?? 0),
      published_properties: Number(metrics?.published_properties ?? 0),
      portfolio_value: Number(metrics?.portfolio_value ?? 0),
      recent_properties_30d: Number(recent?.recent_properties ?? 0),
    },
  })
})

app.get('/v1/agency/settings', async (c) => {
  const agencyId = parseAgencyId(c.req.header(agencyHeader))

  if (!agencyId) {
    return c.json({ ok: false, error: 'missing_or_invalid_agency_id_header' }, 400)
  }

  const db = getDb(c.env)

  if (!db) {
    return c.json({ ok: false, error: 'd1_not_configured' }, 500)
  }

  const item = await db
    .prepare('select * from website_settings where agency_id = ? limit 1')
    .bind(agencyId)
    .first<WebsiteSettingsRow>()

  return c.json({
    ok: true,
    exists: Boolean(item),
    item: item ?? {
      id: null,
      agency_id: agencyId,
      logo_url: null,
      primary_color: null,
      secondary_color: null,
      fonts: null,
      hero_style: null,
      layout_style: null,
      default_chat_widget: null,
      default_form_embed: null,
      default_calendar_embed: null,
      created_at: null,
      updated_at: null,
    },
  })
})

app.patch('/v1/agency/settings', async (c) => {
  const agencyId = parseAgencyId(c.req.header(agencyHeader))

  if (!agencyId) {
    return c.json({ ok: false, error: 'missing_or_invalid_agency_id_header' }, 400)
  }

  const body = await c.req.json()
  const parsedBody = websiteSettingsPatchSchema.safeParse(body)

  if (!parsedBody.success) {
    return c.json({ ok: false, error: 'invalid_payload', details: parsedBody.error.flatten() }, 400)
  }

  const db = getDb(c.env)

  if (!db) {
    return c.json({ ok: false, error: 'd1_not_configured' }, 500)
  }

  const current = await db
    .prepare('select * from website_settings where agency_id = ? limit 1')
    .bind(agencyId)
    .first<WebsiteSettingsRow>()

  const now = new Date().toISOString()

  if (!current) {
    const id = crypto.randomUUID()
    await db
      .prepare(
        `insert into website_settings (
          id, agency_id, logo_url, primary_color, secondary_color, fonts,
          hero_style, layout_style, default_chat_widget, default_form_embed,
          default_calendar_embed, created_at, updated_at
        ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        agencyId,
        parsedBody.data.logo_url ?? null,
        parsedBody.data.primary_color ?? null,
        parsedBody.data.secondary_color ?? null,
        parsedBody.data.fonts ?? null,
        parsedBody.data.hero_style ?? null,
        parsedBody.data.layout_style ?? null,
        parsedBody.data.default_chat_widget ?? null,
        parsedBody.data.default_form_embed ?? null,
        parsedBody.data.default_calendar_embed ?? null,
        now,
        now
      )
      .run()
  } else {
    const next = {
      ...current,
      ...parsedBody.data,
      updated_at: now,
    }

    await db
      .prepare(
        `update website_settings set
          logo_url = ?, primary_color = ?, secondary_color = ?, fonts = ?,
          hero_style = ?, layout_style = ?, default_chat_widget = ?, default_form_embed = ?,
          default_calendar_embed = ?, updated_at = ?
        where agency_id = ?`
      )
      .bind(
        next.logo_url ?? null,
        next.primary_color ?? null,
        next.secondary_color ?? null,
        next.fonts ?? null,
        next.hero_style ?? null,
        next.layout_style ?? null,
        next.default_chat_widget ?? null,
        next.default_form_embed ?? null,
        next.default_calendar_embed ?? null,
        next.updated_at,
        agencyId
      )
      .run()
  }

  const updated = await db
    .prepare('select * from website_settings where agency_id = ? limit 1')
    .bind(agencyId)
    .first<WebsiteSettingsRow>()

  return c.json({ ok: true, item: updated ?? null })
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

app.get('/v1/properties/:id/images', async (c) => {
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

  const property = await db
    .prepare('select id from properties where id = ? and agency_id = ? limit 1')
    .bind(propertyId, agencyId)
    .first<{ id: string }>()

  if (!property) {
    return c.json({ ok: false, error: 'property_not_found' }, 404)
  }

  const { results } = await db
    .prepare('select * from property_images where property_id = ? and agency_id = ? order by sort_order asc, created_at asc')
    .bind(propertyId, agencyId)
    .all<PropertyImageRow>()

  return c.json({ ok: true, items: (results ?? []).map(mapPropertyImageRow) })
})

app.post('/v1/properties/:id/images', async (c) => {
  const agencyId = parseAgencyId(c.req.header(agencyHeader))
  const propertyId = c.req.param('id')

  if (!agencyId) {
    return c.json({ ok: false, error: 'missing_or_invalid_agency_id_header' }, 400)
  }

  if (!agencyIdSchema.safeParse(propertyId).success) {
    return c.json({ ok: false, error: 'invalid_property_id' }, 400)
  }

  const body = await c.req.json()
  const parsedBody = propertyImageUploadSchema.safeParse(body)

  if (!parsedBody.success) {
    return c.json({ ok: false, error: 'invalid_payload', details: parsedBody.error.flatten() }, 400)
  }

  const db = getDb(c.env)
  const bucket = getMediaBucket(c.env)

  if (!db) {
    return c.json({ ok: false, error: 'd1_not_configured' }, 500)
  }

  if (!bucket) {
    return c.json({ ok: false, error: 'r2_not_configured' }, 500)
  }

  const property = await db
    .prepare('select id from properties where id = ? and agency_id = ? limit 1')
    .bind(propertyId, agencyId)
    .first<{ id: string }>()

  if (!property) {
    return c.json({ ok: false, error: 'property_not_found' }, 404)
  }

  const imageId = crypto.randomUUID()
  const now = new Date().toISOString()
  const safeFilename = sanitizeFilename(parsedBody.data.filename)
  const objectKey = `${agencyId}/${propertyId}/${Date.now()}-${safeFilename}`
  const bytes = decodeBase64(parsedBody.data.data_base64)

  await bucket.put(objectKey, bytes, {
    httpMetadata: {
      contentType: parsedBody.data.content_type,
    },
  })

  const { results } = await db
    .prepare('select coalesce(max(sort_order), 0) as max_sort_order from property_images where property_id = ? and agency_id = ?')
    .bind(propertyId, agencyId)
    .all<{ max_sort_order: number }>()

  const maxSortOrder = results?.[0]?.max_sort_order ?? 0
  const nextSortOrder = Number(maxSortOrder) + 1

  if (parsedBody.data.is_primary) {
    await db
      .prepare('update property_images set is_primary = 0, updated_at = ? where property_id = ? and agency_id = ?')
      .bind(now, propertyId, agencyId)
      .run()
  }

  const imageUrl = `https://media.nexusre.local/${objectKey}`

  await db
    .prepare(
      `insert into property_images (
        id, property_id, agency_id, object_key, image_url, content_type, file_size_bytes,
        is_primary, sort_order, created_at, updated_at
      ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      imageId,
      propertyId,
      agencyId,
      objectKey,
      imageUrl,
      parsedBody.data.content_type,
      bytes.byteLength,
      toDbBoolean(parsedBody.data.is_primary),
      nextSortOrder,
      now,
      now
    )
    .run()

  const inserted = await db
    .prepare('select * from property_images where id = ? and agency_id = ? limit 1')
    .bind(imageId, agencyId)
    .first<PropertyImageRow>()

  return c.json({ ok: true, item: inserted ? mapPropertyImageRow(inserted) : null }, 201)
})

app.patch('/v1/properties/:propertyId/images/:imageId/primary', async (c) => {
  const agencyId = parseAgencyId(c.req.header(agencyHeader))
  const propertyId = c.req.param('propertyId')
  const imageId = c.req.param('imageId')

  if (!agencyId) {
    return c.json({ ok: false, error: 'missing_or_invalid_agency_id_header' }, 400)
  }

  if (!agencyIdSchema.safeParse(propertyId).success || !agencyIdSchema.safeParse(imageId).success) {
    return c.json({ ok: false, error: 'invalid_id' }, 400)
  }

  const db = getDb(c.env)

  if (!db) {
    return c.json({ ok: false, error: 'd1_not_configured' }, 500)
  }

  const found = await db
    .prepare('select id from property_images where id = ? and property_id = ? and agency_id = ? limit 1')
    .bind(imageId, propertyId, agencyId)
    .first<{ id: string }>()

  if (!found) {
    return c.json({ ok: false, error: 'property_image_not_found' }, 404)
  }

  const now = new Date().toISOString()

  await db
    .prepare('update property_images set is_primary = 0, updated_at = ? where property_id = ? and agency_id = ?')
    .bind(now, propertyId, agencyId)
    .run()

  await db
    .prepare('update property_images set is_primary = 1, updated_at = ? where id = ? and property_id = ? and agency_id = ?')
    .bind(now, imageId, propertyId, agencyId)
    .run()

  const updated = await db
    .prepare('select * from property_images where id = ? and property_id = ? and agency_id = ? limit 1')
    .bind(imageId, propertyId, agencyId)
    .first<PropertyImageRow>()

  return c.json({ ok: true, item: updated ? mapPropertyImageRow(updated) : null })
})

app.delete('/v1/properties/:propertyId/images/:imageId', async (c) => {
  const agencyId = parseAgencyId(c.req.header(agencyHeader))
  const propertyId = c.req.param('propertyId')
  const imageId = c.req.param('imageId')

  if (!agencyId) {
    return c.json({ ok: false, error: 'missing_or_invalid_agency_id_header' }, 400)
  }

  if (!agencyIdSchema.safeParse(propertyId).success || !agencyIdSchema.safeParse(imageId).success) {
    return c.json({ ok: false, error: 'invalid_id' }, 400)
  }

  const db = getDb(c.env)
  const bucket = getMediaBucket(c.env)

  if (!db) {
    return c.json({ ok: false, error: 'd1_not_configured' }, 500)
  }

  if (!bucket) {
    return c.json({ ok: false, error: 'r2_not_configured' }, 500)
  }

  const found = await db
    .prepare('select id, object_key from property_images where id = ? and property_id = ? and agency_id = ? limit 1')
    .bind(imageId, propertyId, agencyId)
    .first<{ id: string; object_key: string }>()

  if (!found) {
    return c.json({ ok: false, error: 'property_image_not_found' }, 404)
  }

  await bucket.delete(found.object_key)

  await db
    .prepare('delete from property_images where id = ? and property_id = ? and agency_id = ?')
    .bind(imageId, propertyId, agencyId)
    .run()

  return c.json({ ok: true, deleted_id: found.id })
})

app.patch('/v1/properties/:propertyId/images/reorder', async (c) => {
  const agencyId = parseAgencyId(c.req.header(agencyHeader))
  const propertyId = c.req.param('propertyId')

  if (!agencyId) {
    return c.json({ ok: false, error: 'missing_or_invalid_agency_id_header' }, 400)
  }

  if (!agencyIdSchema.safeParse(propertyId).success) {
    return c.json({ ok: false, error: 'invalid_property_id' }, 400)
  }

  const body = await c.req.json()
  const parsedBody = propertyImageReorderSchema.safeParse(body)

  if (!parsedBody.success) {
    return c.json({ ok: false, error: 'invalid_payload', details: parsedBody.error.flatten() }, 400)
  }

  const db = getDb(c.env)

  if (!db) {
    return c.json({ ok: false, error: 'd1_not_configured' }, 500)
  }

  const existing = await db
    .prepare('select id from property_images where property_id = ? and agency_id = ?')
    .bind(propertyId, agencyId)
    .all<{ id: string }>()

  const existingIds = new Set((existing.results ?? []).map((row) => row.id))
  const receivedIds = parsedBody.data.image_ids

  if (existingIds.size !== receivedIds.length) {
    return c.json({ ok: false, error: 'image_count_mismatch' }, 400)
  }

  const allIdsMatch = receivedIds.every((id) => existingIds.has(id))

  if (!allIdsMatch) {
    return c.json({ ok: false, error: 'unknown_image_id_in_payload' }, 400)
  }

  const now = new Date().toISOString()
  const statements = receivedIds.map((imageId, index) =>
    db
      .prepare('update property_images set sort_order = ?, updated_at = ? where id = ? and property_id = ? and agency_id = ?')
      .bind(index + 1, now, imageId, propertyId, agencyId)
  )

  await db.batch(statements)

  const ordered = await db
    .prepare('select * from property_images where property_id = ? and agency_id = ? order by sort_order asc, created_at asc')
    .bind(propertyId, agencyId)
    .all<PropertyImageRow>()

  return c.json({ ok: true, items: (ordered.results ?? []).map(mapPropertyImageRow) })
})

export default app
