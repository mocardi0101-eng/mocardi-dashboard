-- Tabel users
create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text unique not null,
  pin_hash text not null,
  created_at timestamptz default now()
);

-- RLS
alter table users enable row level security;
create policy "allow_all_users" on users for all using (true) with check (true);
