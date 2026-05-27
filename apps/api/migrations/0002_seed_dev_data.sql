-- NEXUS RE - D1 dev seed data
-- Safe to run multiple times (INSERT OR IGNORE)

PRAGMA foreign_keys = ON;

insert or ignore into agencies (id, name, slug, active, created_at, updated_at)
values (
  '11111111-1111-4111-8111-111111111111',
  'Epic Real Estate Demo',
  'epic-demo',
  1,
  datetime('now'),
  datetime('now')
);

insert or ignore into informational_agents (id, agency_id, name, phone, email, photo, bio, created_at, updated_at)
values (
  '22222222-2222-4222-8222-222222222222',
  '11111111-1111-4111-8111-111111111111',
  'Laura Mendez',
  '+50255550001',
  'laura@nexusre.demo',
  'https://images.example.com/agents/laura.jpg',
  'Asesora inmobiliaria para zonas premium.',
  datetime('now'),
  datetime('now')
);

insert or ignore into properties (
  id, agency_id, agent_id, title, slug, description, listing_type, property_type, status,
  currency, price, bedrooms, bathrooms, parking_spaces, size_m2, address, city, zone,
  latitude, longitude, featured, published, maintenance_fee, year_built, video_url,
  virtual_tour_url, created_at, updated_at
)
values (
  '33333333-3333-4333-8333-333333333333',
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  'Casa moderna en zona 10',
  'casa-moderna-zona-10',
  'Casa de 3 niveles con jardin y terraza.',
  'venta',
  'casa',
  'disponible',
  'USD',
  325000,
  4,
  3,
  2,
  260,
  '10 avenida 12-34',
  'Guatemala',
  'Zona 10',
  14.6036,
  -90.4894,
  1,
  1,
  120,
  2019,
  null,
  null,
  datetime('now'),
  datetime('now')
);
