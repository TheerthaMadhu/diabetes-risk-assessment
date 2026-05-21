
-- profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- assessments table
create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  inputs jsonb not null,
  probability numeric not null,
  risk_level text not null check (risk_level in ('Low','Moderate','High')),
  created_at timestamptz not null default now()
);

create index assessments_user_id_created_at_idx
  on public.assessments(user_id, created_at desc);

alter table public.assessments enable row level security;

create policy "Users can view own assessments"
  on public.assessments for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own assessments"
  on public.assessments for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete own assessments"
  on public.assessments for delete
  to authenticated
  using (auth.uid() = user_id);

-- handle new user trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
