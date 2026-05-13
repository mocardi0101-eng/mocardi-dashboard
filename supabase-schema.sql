-- Tabel orders
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  order_number integer not null,
  items_text text not null,
  summary text not null,
  total integer not null,
  status text not null default 'active',
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- Tabel inventory
create table if not exists inventory (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  label text not null,
  unit text not null,
  stock integer not null default 0,
  min_stock integer not null default 0,
  max_stock integer not null default 1000,
  updated_at timestamptz default now()
);

-- Tabel settings
create table if not exists settings (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value text not null,
  updated_at timestamptz default now()
);

-- Data awal inventory
insert into inventory (key, label, unit, stock, min_stock, max_stock) values
  ('tepung',  'Tepung',        'g',     1500, 300,  2000),
  ('telur',   'Telur',         'butir', 40,   10,   50),
  ('butter',  'Butter',        'g',     800,  150,  1000),
  ('gula',    'Gula',          'g',     800,  150,  1000),
  ('coklat',  'Coklat Bubuk',  'g',     400,  80,   500),
  ('susu',    'Susu',          'ml',    800,  150,  1000),
  ('keju',    'Cream Cheese',  'g',     500,  100,  600),
  ('kopi',    'Kopi Espresso', 'ml',    250,  50,   300)
on conflict (key) do nothing;

-- Data awal settings
insert into settings (key, value) values
  ('max_capacity', '50'),
  ('mode', 'normal')
on conflict (key) do nothing;

-- Enable realtime
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table inventory;
