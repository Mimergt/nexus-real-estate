-- NEXUS RE - D1 initial MVP schema
-- Scope: agencies, users, informational_agents, properties

PRAGMA foreign_keys = ON;

create table if not exists agencies (
  id text primary key,
  name text not null,
  slug text not null unique,
  active integer not null default 1,
  created_at text not null,
  updated_at text not null
);

create table if not exists users (
  id text primary key,
  agency_id text,
  role text not null check (role in ('admin', 'agency_user')),
  email text not null unique,
  full_name text,
  active integer not null default 1,
  created_at text not null,
  updated_at text not null,
  foreign key (agency_id) references agencies(id) on delete set null
);

create table if not exists informational_agents (
  id text primary key,
  agency_id text not null,
  name text not null,
  phone text,
  email text,
  photo text,
  bio text,
  created_at text not null,
  updated_at text not null,
  foreign key (agency_id) references agencies(id) on delete cascade
);

create table if not exists properties (
  id text primary key,
  agency_id text not null,
  agent_id text,
  title text not null,
  slug text not null,
  description text not null,
  listing_type text not null check (listing_type in ('venta', 'renta')),
  property_type text not null,
  status text not null,
  currency text not null,
  price real not null,
  bedrooms integer not null default 0,
  bathrooms integer not null default 0,
  parking_spaces integer not null default 0,
  size_m2 real not null,
  address text not null,
  city text not null,
  zone text not null,
  latitude real not null,
  longitude real not null,
  featured integer not null default 0,
  published integer not null default 0,
  maintenance_fee real,
  year_built integer,
  video_url text,
  virtual_tour_url text,
  created_at text not null,
  updated_at text not null,
  unique (agency_id, slug),
  foreign key (agency_id) references agencies(id) on delete cascade,
  foreign key (agent_id) references informational_agents(id) on delete set null
);

create index if not exists idx_users_agency_id on users(agency_id);
create index if not exists idx_info_agents_agency_id on informational_agents(agency_id);
create index if not exists idx_properties_agency_id on properties(agency_id);
create index if not exists idx_properties_listing_type on properties(listing_type);
create index if not exists idx_properties_property_type on properties(property_type);
create index if not exists idx_properties_city_zone on properties(city, zone);
create index if not exists idx_properties_price on properties(price);
create index if not exists idx_properties_published on properties(published);
create index if not exists idx_properties_featured on properties(featured);

create trigger if not exists trg_agencies_updated_at
after update on agencies
for each row
when new.updated_at = old.updated_at
begin
  update agencies set updated_at = datetime('now') where id = old.id;
end;

create trigger if not exists trg_users_updated_at
after update on users
for each row
when new.updated_at = old.updated_at
begin
  update users set updated_at = datetime('now') where id = old.id;
end;

create trigger if not exists trg_info_agents_updated_at
after update on informational_agents
for each row
when new.updated_at = old.updated_at
begin
  update informational_agents set updated_at = datetime('now') where id = old.id;
end;

create trigger if not exists trg_properties_updated_at
after update on properties
for each row
when new.updated_at = old.updated_at
begin
  update properties set updated_at = datetime('now') where id = old.id;
end;
