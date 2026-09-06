-- Run this ONCE in Supabase Dashboard > SQL Editor for an existing project.
-- It changes profiles.role into a dropdown with: Owner, Management, Employee, Client.

do $$
begin
  create type public.user_role as enum ('Owner', 'Management', 'Employee');
exception
  when duplicate_object then null;
end $$;

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  alter column role drop default,
  alter column role type public.user_role using role::public.user_role,
  alter column role set default 'Employee'::public.user_role;

create or replace function public.get_my_role()
returns text
language sql stable security definer
set search_path = public
as $$
  select role::text from public.profiles where id = auth.uid();
$$;

-- Add a visible email field to profiles and fill it for all existing users.
alter table public.profiles add column if not exists email text;

update public.profiles as profile
set email = auth_user.email
from auth.users as auth_user
where profile.id = auth_user.id
  and profile.email is null;

-- Keep the email field populated automatically for every new login account.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, 'Employee');
  return new;
end;
$$ language plpgsql security definer;
