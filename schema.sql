-- ============================================================
-- YUZI MARKETING MEDIA — CRM DATABASE SCHEMA
-- Is poori file ko Supabase Dashboard > SQL Editor mein paste
-- karke "Run" dabao. Ek hi baar chalana hai.
-- ============================================================

create extension if not exists pgcrypto;

-- Fixed role options. Supabase Table Editor will show this as a dropdown.
do $$
begin
  create type public.user_role as enum ('Owner', 'Management', 'Employee');
exception
  when duplicate_object then null;
end $$;

-- ------------------------------------------------------------
-- 1. PROFILES (har login user ka role yahan store hota hai)
-- ------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role public.user_role not null default 'Employee',
  employee_name text,        -- Employee role ke liye: tasks/leaves mein yehi naam match hoga
  client_id uuid,            -- Client role ke liye: kis client se linked hai
  created_at timestamptz default now()
);

-- Naya user signup hote hi profile row apne aap ban jaye (default role: Employee)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, 'Employee');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper functions (policies inhe use karengi)
create or replace function get_my_role() returns text
language sql stable security definer
set search_path = public
as $$
  select role::text from public.profiles where id = auth.uid();
$$;

create or replace function get_my_employee_name() returns text
language sql stable security definer
set search_path = public
as $$
  select employee_name from public.profiles where id = auth.uid();
$$;

create or replace function get_my_client_id() returns uuid
language sql stable security definer
set search_path = public
as $$
  select client_id from public.profiles where id = auth.uid();
$$;

alter table profiles enable row level security;
create policy "view_own_profile" on profiles for select using (id = auth.uid());
create policy "owner_mgmt_view_all_profiles" on profiles for select using (get_my_role() in ('Owner','Management'));
create policy "owner_mgmt_manage_profiles" on profiles for update using (get_my_role() in ('Owner','Management'));

-- ------------------------------------------------------------
-- 2. CLIENTS
-- ------------------------------------------------------------
create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'Onboarding' check (status in ('Onboarding','Active','At Risk','Paused')),
  account_manager text,
  team text[] default '{}',
  services text[] default '{}',
  monthly_value numeric default 0,
  onboarding int default 0,
  created_at timestamptz default now()
);

alter table clients enable row level security;
create policy "owner_mgmt_full_access_clients" on clients for all using (get_my_role() in ('Owner','Management'));
create policy "employee_view_clients" on clients for select using (get_my_role() = 'Employee');
create policy "client_view_own_row" on clients for select using (get_my_role() = 'Client' and id = get_my_client_id());

-- ------------------------------------------------------------
-- 3. LEADS
-- ------------------------------------------------------------
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  source text,
  salesperson text,
  stage text not null default 'New' check (stage in ('New','Meeting','Proposal','Negotiation','Won','Lost')),
  value numeric default 0,
  last_contact date,
  notes text,
  created_at timestamptz default now()
);

alter table leads enable row level security;
create policy "owner_mgmt_full_access_leads" on leads for all using (get_my_role() in ('Owner','Management'));

-- ------------------------------------------------------------
-- 4. TASKS (projects / content production workflow)
-- ------------------------------------------------------------
create table tasks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  title text not null,
  type text,
  assignee text,
  priority text default 'Medium' check (priority in ('Low','Medium','High')),
  content_stage text default 'Idea' check (content_stage in
    ('Idea','Script','Approval','Shoot','Editing','QC','Client Review','Revision','Final Approval','Publish')),
  status text default 'Todo' check (status in ('Todo','In Progress','Review','Blocked','Done')),
  due date,
  delay_reason text,
  created_at timestamptz default now()
);

alter table tasks enable row level security;
create policy "owner_mgmt_full_access_tasks" on tasks for all using (get_my_role() in ('Owner','Management'));
create policy "employee_view_all_tasks" on tasks for select using (get_my_role() = 'Employee');
create policy "employee_update_all_tasks" on tasks for update using (get_my_role() = 'Employee') with check (get_my_role() = 'Employee');

-- ------------------------------------------------------------
-- 5. LEAVES
-- ------------------------------------------------------------
create table leaves (
  id uuid primary key default gen_random_uuid(),
  employee text not null,
  type text not null default 'Casual' check (type in ('Casual','Sick','Paid','Unpaid')),
  from_date date not null,
  to_date date not null,
  reason text,
  status text not null default 'Pending' check (status in ('Pending','Approved','Rejected')),
  applied_by text,
  created_at timestamptz default now()
);

alter table leaves enable row level security;
create policy "owner_mgmt_full_access_leaves" on leaves for all using (get_my_role() in ('Owner','Management'));
create policy "everyone_can_view_leaves" on leaves for select using (auth.role() = 'authenticated');
create policy "employee_insert_own_leave" on leaves for insert with check (
  get_my_role() = 'Employee' and employee = get_my_employee_name()
);

-- ------------------------------------------------------------
-- 6. Realtime on (taaki sabki screen live update ho)
-- ------------------------------------------------------------
alter publication supabase_realtime add table clients, leads, tasks, leaves;

-- ============================================================
-- DONE. Ab Table Editor mein jaake thoda sample data daal sakte ho,
-- ya seedha app se add karo.
-- ============================================================
