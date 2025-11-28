# Supabase Database Setup for SubsTrack

Run the following SQL script in your Supabase SQL Editor to set up the database schema.

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table (Managed by Supabase Auth, but we can have a public profile table if needed)
-- For this MVP, we'll assume we link data to the auth.users.id

-- 2. Categories Table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default categories
insert into public.categories (name, color) values
  ('Entertainment', '#E50914'),
  ('Music', '#1DB954'),
  ('Productivity', '#000000'),
  ('Utilities', '#4B6BFB'),
  ('Food', '#FC8019'),
  ('Health', '#F49E26');

-- 3. Subscriptions Table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade, -- Links to Supabase Auth User
  name text not null,
  description text,
  monthly_cost numeric not null,
  billing_cycle text default 'monthly', -- 'monthly', 'yearly'
  start_date date not null,
  renewal_date date,
  category text, -- Can link to categories table or just store text
  color text,
  status text default 'active', -- 'active', 'cancelled', 'expired'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.subscriptions enable row level security;

-- Policies for Subscriptions
-- Allow users to view their own subscriptions
create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Allow users to insert their own subscriptions
create policy "Users can insert their own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

-- Allow users to update their own subscriptions
create policy "Users can update their own subscriptions"
  on public.subscriptions for update
  using (auth.uid() = user_id);

-- Allow users to delete their own subscriptions
create policy "Users can delete their own subscriptions"
  on public.subscriptions for delete
  using (auth.uid() = user_id);

-- 4. Wallet/Transactions Table (Optional for now)
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id),
  amount numeric not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  type text default 'debit', -- 'credit', 'debit'
  description text
);

alter table public.transactions enable row level security;

create policy "Users can view their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

```

## Instructions
1. Go to your Supabase Project Dashboard.
2. Navigate to the **SQL Editor**.
3. Paste the code above and click **Run**.
4. Your database is now ready!
