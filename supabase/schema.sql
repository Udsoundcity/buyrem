-- ============================================================
-- Custom Order Form - Supabase schema (v2: multi-tier pricing)
-- Run this once in Supabase SQL Editor (Project > SQL Editor > New query)
--
-- If you already ran the earlier version of this schema, this file is
-- safe to re-run - it uses IF NOT EXISTS / OR REPLACE everywhere and
-- only touches the pieces that changed (adds settings.tiers +
-- settings.display_style, renames orders.offer -> orders.tier_label,
-- replaces create_order(), and removes the now-unused direct-insert
-- policy + trigger). See the note at the bottom about existing order
-- data if you've already collected real orders under the old schema.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- settings: single row holding product name, promo message,
-- display style, and the list of selectable price tiers
-- ------------------------------------------------------------
create table if not exists public.settings (
  id int primary key default 1,
  product_name text not null default '',
  promo_message text not null default '',
  display_style text not null default 'bullet'
    check (display_style in ('dropdown', 'checkbox', 'bullet')),
  tiers jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);

-- Upgrade path from the single price/offer version of this table.
alter table public.settings add column if not exists promo_message text not null default '';
alter table public.settings add column if not exists display_style text not null default 'bullet';
alter table public.settings add column if not exists tiers jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1 from information_schema.constraint_column_usage
    where table_name = 'settings' and constraint_name = 'settings_display_style_check'
  ) then
    alter table public.settings
      add constraint settings_display_style_check
      check (display_style in ('dropdown', 'checkbox', 'bullet'));
  end if;
exception when duplicate_object then
  null;
end $$;

insert into public.settings (id, product_name, promo_message, display_style, tiers)
values (
  1,
  'Your Product',
  '',
  'bullet',
  '[]'::jsonb
)
on conflict (id) do nothing;

-- keep updated_at fresh
create or replace function public.touch_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_touch_settings_updated_at on public.settings;
create trigger trg_touch_settings_updated_at
before update on public.settings
for each row execute function public.touch_settings_updated_at();

-- ------------------------------------------------------------
-- orders
-- ------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  address text not null,
  state text not null,
  product_name text not null default '',
  tier_label text,
  price numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

-- Upgrade path: the old schema had an "offer" column - rename it if present.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'orders' and column_name = 'offer'
  ) and not exists (
    select 1 from information_schema.columns
    where table_name = 'orders' and column_name = 'tier_label'
  ) then
    alter table public.orders rename column offer to tier_label;
  end if;
end $$;

alter table public.orders add column if not exists tier_label text;

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_state_idx on public.orders (state);
create index if not exists orders_full_name_idx on public.orders using gin (to_tsvector('simple', full_name));
create index if not exists orders_phone_idx on public.orders (phone);

-- Drop the old "always overwrite from settings" trigger/function - pricing
-- is no longer a single fixed value, it's validated per-tier inside
-- create_order() below instead.
drop trigger if exists trg_set_order_product_fields on public.orders;
drop function if exists public.set_order_product_fields();

-- The public order form calls this to create an order. It looks up the
-- chosen tier by id inside settings.tiers itself - the client only ever
-- sends a tier id, never a price - so a customer can't submit an
-- arbitrary price/label even by calling the API directly. Also avoids
-- needing a general SELECT policy on orders for anonymous visitors,
-- since it hands back the new order's id directly.
create or replace function public.create_order(
  p_full_name text,
  p_phone text,
  p_address text,
  p_state text,
  p_tier_id text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  s record;
  tier jsonb;
  new_id uuid;
begin
  select product_name, tiers into s from public.settings where id = 1;

  select t into tier
  from jsonb_array_elements(coalesce(s.tiers, '[]'::jsonb)) as t
  where t->>'id' = p_tier_id
  limit 1;

  if tier is null then
    raise exception 'Invalid tier selected';
  end if;

  insert into public.orders (full_name, phone, address, state, product_name, tier_label, price)
  values (
    p_full_name,
    p_phone,
    p_address,
    p_state,
    coalesce(s.product_name, ''),
    tier->>'label',
    (tier->>'price')::numeric
  )
  returning id into new_id;

  return new_id;
end;
$$;

revoke all on function public.create_order(text, text, text, text, text) from public;
grant execute on function public.create_order(text, text, text, text, text) to anon, authenticated;

-- Drop the old 4-argument version of this function if it exists from the
-- earlier single-price schema, so there's no ambiguous overload left behind.
drop function if exists public.create_order(text, text, text, text);

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.orders enable row level security;
alter table public.settings enable row level security;

-- Orders: nobody gets a direct INSERT policy anymore - all order creation
-- goes through create_order() above, which runs as SECURITY DEFINER and
-- validates the tier/price server-side. Only signed-in users (your admin
-- login) can read, update or delete orders.
drop policy if exists "Public can insert orders" on public.orders;

drop policy if exists "Authenticated can view orders" on public.orders;
create policy "Authenticated can view orders"
on public.orders for select
to authenticated
using (true);

drop policy if exists "Authenticated can update orders" on public.orders;
create policy "Authenticated can update orders"
on public.orders for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete orders" on public.orders;
create policy "Authenticated can delete orders"
on public.orders for delete
to authenticated
using (true);

-- Settings: everyone can read (the public order form needs the current
-- product name/tiers to display), only signed-in admins can update.
drop policy if exists "Public can read settings" on public.settings;
create policy "Public can read settings"
on public.settings for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can update settings" on public.settings;
create policy "Authenticated can update settings"
on public.settings for update
to authenticated
using (id = 1)
with check (id = 1);

-- No insert/delete policy on settings for anyone other than the table
-- owner - the single row is created above and should never be removed.

-- ------------------------------------------------------------
-- NOTE on upgrading from the single-price schema with real order data:
-- Existing rows keep their price/tier_label (renamed from "offer") as-is.
-- Only NEW orders going forward require a tier to be selected in
-- settings.tiers - make sure you fill in settings.tiers via the /form
-- page before your order form goes live, or create_order() will always
-- raise "Invalid tier selected".
-- ------------------------------------------------------------

-- ============================================================
-- v3: configurable required/optional fields + order status
-- Safe to re-run - only adds what's missing.
-- ============================================================

-- Which of the 4 form fields are required. All default to required (true)
-- to match original behavior; flip any to false in /form to make it
-- optional on the order form.
alter table public.settings add column if not exists field_config jsonb not null default
  '{"full_name": true, "phone": true, "address": true, "state": true}'::jsonb;

-- Order status, settable by admins on buyrem.com/admin/orders.
alter table public.orders add column if not exists status text not null default 'submitted';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_status_check'
  ) then
    alter table public.orders
      add constraint orders_status_check
      check (status in ('submitted', 'postponed', 'delivered', 'unserious'));
  end if;
end $$;

create index if not exists orders_status_idx on public.orders (status);

-- create_order() now accepts optional fields as empty strings when a field
-- is turned off in /form - required-ness is enforced by the order form's
-- own validation (driven by settings.field_config), not by the database,
-- since which fields are required can change over time. The columns stay
-- NOT NULL text so an empty string ('') is what's stored when a field is
-- skipped, never NULL.
