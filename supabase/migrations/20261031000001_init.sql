-- Crumble & Co. — initial schema, policies and order function.
-- Apply with: supabase db push   (or paste into the Supabase SQL editor)

create extension if not exists pgcrypto;

create type public.user_role as enum ('customer', 'admin');
create type public.order_status as enum ('pending', 'confirmed', 'baking', 'dispatched', 'delivered', 'cancelled');
create type public.payment_method as enum ('cash_on_delivery', 'upi_on_delivery');
create type public.fulfilment_method as enum ('delivery', 'pickup');
create type public.cake_request_status as enum ('new', 'reviewing', 'quoted', 'accepted', 'declined');

-- ---------------------------------------------------------------- catalogue

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  category_id uuid references public.categories(id) on delete set null,
  base_price numeric(10, 2) not null check (base_price >= 0),
  weight text,
  ingredients text[] not null default '{}',
  allergens text[] not null default '{}',
  dietary text[] not null default '{}',
  storage text,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  is_bestseller boolean not null default false,
  search_vector tsvector generated always as (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on public.products (category_id);
create index products_search_idx on public.products using gin (search_vector);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  price numeric(10, 2) not null check (price >= 0),
  stock int not null default 0 check (stock >= 0),
  sort_order int not null default 0,
  unique (product_id, label)
);

create index product_variants_product_idx on public.product_variants (product_id);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text not null default '',
  sort_order int not null default 0
);

create index product_images_product_idx on public.product_images (product_id);

-- ---------------------------------------------------------------- customers

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Home',
  line1 text not null,
  line2 text,
  landmark text,
  city text not null,
  state text not null,
  pincode text not null check (pincode ~ '^[0-9]{6}$'),
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index addresses_user_idx on public.addresses (user_id);

-- ---------------------------------------------------------------- orders

create sequence public.order_number_seq start 1001;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default (
    'CRB-' || to_char(now(), 'YYMM') || '-' || lpad(nextval('public.order_number_seq')::text, 5, '0')
  ),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  phone text not null,
  email text,
  address_line1 text not null default '',
  address_line2 text,
  landmark text,
  city text not null default '',
  state text not null default '',
  pincode text not null default '',
  fulfilment public.fulfilment_method not null default 'delivery',
  delivery_date date not null,
  delivery_slot text not null,
  notes text,
  payment_method public.payment_method not null default 'cash_on_delivery',
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  delivery_fee numeric(10, 2) not null default 0 check (delivery_fee >= 0),
  total numeric(10, 2) not null check (total >= 0),
  status public.order_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_total_matches check (total = subtotal + delivery_fee)
);

create index orders_user_idx on public.orders (user_id, created_at desc);
create index orders_phone_idx on public.orders (phone);
create index orders_status_idx on public.orders (status);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  variant_label text,
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  quantity int not null check (quantity > 0 and quantity <= 50),
  line_total numeric(10, 2) not null check (line_total >= 0),
  constraint order_items_line_total check (line_total = unit_price * quantity)
);

create index order_items_order_idx on public.order_items (order_id);

create table public.order_status_history (
  id bigserial primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  status public.order_status not null,
  note text,
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index order_status_history_order_idx on public.order_status_history (order_id, created_at);

create table public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- ---------------------------------------------------------------- requests

create table public.custom_cake_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  flavour text not null,
  size text not null,
  shape text not null,
  occasion text not null,
  design_description text not null,
  preferred_date date not null,
  budget_range text not null,
  reference_image_url text,
  status public.cake_request_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index custom_cake_requests_status_idx on public.custom_cake_requests (status, created_at desc);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

create table public.store_settings (
  id boolean primary key default true check (id),
  delivery_fee numeric(10, 2) not null default 50,
  free_delivery_threshold numeric(10, 2) not null default 1500,
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  opening_hours text not null default '',
  bake_drop_times text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.store_settings (id) values (true) on conflict do nothing;

-- ---------------------------------------------------------------- helpers

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();
create trigger cake_requests_updated_at before update on public.custom_cake_requests
  for each row execute function public.set_updated_at();
create trigger store_settings_updated_at before update on public.store_settings
  for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- New signups get a profile row; the client can never create one directly.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS alone cannot stop a customer from updating their own row, so guard the
-- role column separately. auth.uid() is null for service-role/server jobs.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;
  if new.role is distinct from old.role then
    raise exception 'Only an administrator can change a role';
  end if;
  return new;
end;
$$;

create trigger profiles_guard_role before update on public.profiles
  for each row execute function public.guard_profile_role();

-- ---------------------------------------------------------------- order creation
-- The only write path for orders. Prices come from the database, stock is locked
-- FOR UPDATE so two concurrent carts cannot oversell, and the client only ever
-- sends product/variant ids plus quantities.

create or replace function public.create_order(p_items jsonb, p_customer jsonb)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item jsonb;
  v_line record;
  v_quantity int;
  v_lines jsonb := '[]'::jsonb;
  v_subtotal numeric(10, 2) := 0;
  v_delivery_fee numeric(10, 2) := 0;
  v_store record;
  v_order public.orders;
  v_fulfilment public.fulfilment_method;
begin
  if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'CART_EMPTY' using errcode = 'P0001';
  end if;
  if jsonb_array_length(p_items) > 50 then
    raise exception 'CART_TOO_LARGE' using errcode = 'P0001';
  end if;

  select * into v_store from public.store_settings where id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_quantity := coalesce((v_item ->> 'quantity')::int, 0);
    if v_quantity <= 0 or v_quantity > 50 then
      raise exception 'INVALID_QUANTITY' using errcode = 'P0001';
    end if;

    select pv.id, pv.price, pv.stock, pv.label, p.name, p.id as product_id
      into v_line
      from public.product_variants pv
      join public.products p on p.id = pv.product_id
     where pv.id = (v_item ->> 'variant_id')::uuid
       and p.is_available
       for update of pv;

    if not found then
      raise exception 'ITEM_UNAVAILABLE' using errcode = 'P0001';
    end if;
    if v_line.stock < v_quantity then
      raise exception 'INSUFFICIENT_STOCK:%', v_line.name using errcode = 'P0001';
    end if;

    v_subtotal := v_subtotal + (v_line.price * v_quantity);
    v_lines := v_lines || jsonb_build_object(
      'product_id', v_line.product_id,
      'variant_id', v_line.id,
      'product_name', v_line.name,
      'variant_label', v_line.label,
      'unit_price', v_line.price,
      'quantity', v_quantity
    );
  end loop;

  v_fulfilment := coalesce((p_customer ->> 'fulfilment')::public.fulfilment_method, 'delivery');
  if v_fulfilment = 'delivery' and v_subtotal < v_store.free_delivery_threshold then
    v_delivery_fee := v_store.delivery_fee;
  end if;

  insert into public.orders (
    user_id, customer_name, phone, email,
    address_line1, address_line2, landmark, city, state, pincode,
    fulfilment, delivery_date, delivery_slot, notes, payment_method,
    subtotal, delivery_fee, total, status
  ) values (
    auth.uid(),
    p_customer ->> 'customer_name',
    p_customer ->> 'phone',
    p_customer ->> 'email',
    coalesce(p_customer ->> 'address_line1', ''),
    p_customer ->> 'address_line2',
    p_customer ->> 'landmark',
    coalesce(p_customer ->> 'city', ''),
    coalesce(p_customer ->> 'state', ''),
    coalesce(p_customer ->> 'pincode', ''),
    v_fulfilment,
    (p_customer ->> 'delivery_date')::date,
    p_customer ->> 'delivery_slot',
    p_customer ->> 'notes',
    coalesce((p_customer ->> 'payment_method')::public.payment_method, 'cash_on_delivery'),
    v_subtotal,
    v_delivery_fee,
    v_subtotal + v_delivery_fee,
    'pending'
  )
  returning * into v_order;

  insert into public.order_items (
    order_id, product_id, variant_id, product_name, variant_label, unit_price, quantity, line_total
  )
  select
    v_order.id,
    (line ->> 'product_id')::uuid,
    (line ->> 'variant_id')::uuid,
    line ->> 'product_name',
    line ->> 'variant_label',
    (line ->> 'unit_price')::numeric,
    (line ->> 'quantity')::int,
    (line ->> 'unit_price')::numeric * (line ->> 'quantity')::int
  from jsonb_array_elements(v_lines) as line;

  update public.product_variants pv
     set stock = pv.stock - (line ->> 'quantity')::int
    from jsonb_array_elements(v_lines) as line
   where pv.id = (line ->> 'variant_id')::uuid;

  insert into public.order_status_history (order_id, status, note, changed_by)
  values (v_order.id, 'pending', 'Order placed by customer', auth.uid());

  return v_order;
end;
$$;

revoke all on function public.create_order(jsonb, jsonb) from public;
grant execute on function public.create_order(jsonb, jsonb) to anon, authenticated;

-- ---------------------------------------------------------------- RLS

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.custom_cake_requests enable row level security;
alter table public.contact_messages enable row level security;
alter table public.store_settings enable row level security;

-- Public catalogue
create policy "catalogue is public" on public.categories for select using (true);
create policy "products are public" on public.products for select using (true);
create policy "variants are public" on public.product_variants for select using (true);
create policy "images are public" on public.product_images for select using (true);
create policy "store settings are public" on public.store_settings for select using (true);

create policy "admin writes categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admin writes products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "admin writes variants" on public.product_variants for all using (public.is_admin()) with check (public.is_admin());
create policy "admin writes images" on public.product_images for all using (public.is_admin()) with check (public.is_admin());
create policy "admin writes store settings" on public.store_settings for all using (public.is_admin()) with check (public.is_admin());

-- Profiles: own row only; role escalation is blocked by the trigger above.
create policy "read own profile" on public.profiles for select using (auth.uid() = id);
create policy "update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "admin reads profiles" on public.profiles for select using (public.is_admin());

create policy "own addresses" on public.addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Orders: reads are scoped, writes only through create_order().
create policy "read own orders" on public.orders for select using (auth.uid() = user_id);
create policy "admin reads orders" on public.orders for select using (public.is_admin());
create policy "admin updates orders" on public.orders for update using (public.is_admin()) with check (public.is_admin());

create policy "read own order items" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "admin reads order items" on public.order_items for select using (public.is_admin());

create policy "read own status history" on public.order_status_history for select using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "admin reads status history" on public.order_status_history for select using (public.is_admin());
create policy "admin writes status history" on public.order_status_history for insert with check (public.is_admin());

create policy "own wishlist" on public.wishlist_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Requests: anyone may submit, only the owner or an admin may read.
create policy "anyone submits a cake request" on public.custom_cake_requests for insert with check (true);
create policy "read own cake requests" on public.custom_cake_requests for select using (auth.uid() = user_id);
create policy "admin reads cake requests" on public.custom_cake_requests for select using (public.is_admin());
create policy "admin updates cake requests" on public.custom_cake_requests for update using (public.is_admin()) with check (public.is_admin());

create policy "anyone sends a message" on public.contact_messages for insert with check (true);
create policy "admin reads messages" on public.contact_messages for select using (public.is_admin());

-- ---------------------------------------------------------------- storage
-- Reference images for custom cake requests live in a public-read bucket.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cake-references', 'cake-references', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "anyone uploads a cake reference" on storage.objects for insert
  with check (bucket_id = 'cake-references');

create policy "cake references are readable" on storage.objects for select
  using (bucket_id = 'cake-references');
