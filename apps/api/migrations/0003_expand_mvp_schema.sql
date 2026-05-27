-- NEXUS RE - D1 schema expansion for remaining MVP entities

PRAGMA foreign_keys = ON;

create table if not exists property_images (
  id text primary key,
  property_id text not null,
  agency_id text not null,
  object_key text not null,
  image_url text not null,
  content_type text,
  file_size_bytes integer,
  is_primary integer not null default 0,
  sort_order integer not null default 0,
  created_at text not null,
  updated_at text not null,
  foreign key (property_id) references properties(id) on delete cascade,
  foreign key (agency_id) references agencies(id) on delete cascade
);

create table if not exists property_types (
  id text primary key,
  agency_id text,
  name text not null,
  slug text not null,
  active integer not null default 1,
  created_at text not null,
  updated_at text not null,
  unique (agency_id, slug),
  foreign key (agency_id) references agencies(id) on delete cascade
);

create table if not exists property_features (
  id text primary key,
  agency_id text not null,
  name text not null,
  slug text not null,
  category text,
  active integer not null default 1,
  created_at text not null,
  updated_at text not null,
  unique (agency_id, slug),
  foreign key (agency_id) references agencies(id) on delete cascade
);

create table if not exists website_settings (
  id text primary key,
  agency_id text not null unique,
  logo_url text,
  primary_color text,
  secondary_color text,
  fonts text,
  hero_style text,
  layout_style text,
  default_chat_widget text,
  default_form_embed text,
  default_calendar_embed text,
  created_at text not null,
  updated_at text not null,
  foreign key (agency_id) references agencies(id) on delete cascade
);

create table if not exists templates (
  id text primary key,
  agency_id text,
  name text not null,
  slug text not null,
  description text,
  is_default integer not null default 0,
  active integer not null default 1,
  created_at text not null,
  updated_at text not null,
  unique (agency_id, slug),
  foreign key (agency_id) references agencies(id) on delete cascade
);

create index if not exists idx_property_images_property_id on property_images(property_id);
create index if not exists idx_property_images_agency_id on property_images(agency_id);
create index if not exists idx_property_images_primary on property_images(property_id, is_primary);
create index if not exists idx_property_types_agency_id on property_types(agency_id);
create index if not exists idx_property_features_agency_id on property_features(agency_id);
create index if not exists idx_website_settings_agency_id on website_settings(agency_id);
create index if not exists idx_templates_agency_id on templates(agency_id);

create trigger if not exists trg_property_images_updated_at
after update on property_images
for each row
when new.updated_at = old.updated_at
begin
  update property_images set updated_at = datetime('now') where id = old.id;
end;

create trigger if not exists trg_property_types_updated_at
after update on property_types
for each row
when new.updated_at = old.updated_at
begin
  update property_types set updated_at = datetime('now') where id = old.id;
end;

create trigger if not exists trg_property_features_updated_at
after update on property_features
for each row
when new.updated_at = old.updated_at
begin
  update property_features set updated_at = datetime('now') where id = old.id;
end;

create trigger if not exists trg_website_settings_updated_at
after update on website_settings
for each row
when new.updated_at = old.updated_at
begin
  update website_settings set updated_at = datetime('now') where id = old.id;
end;

create trigger if not exists trg_templates_updated_at
after update on templates
for each row
when new.updated_at = old.updated_at
begin
  update templates set updated_at = datetime('now') where id = old.id;
end;
