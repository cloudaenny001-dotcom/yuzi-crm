-- Run ONCE in Supabase Dashboard > SQL Editor.
-- Changes the app to an internal task workspace:
-- roles: Owner, Management, Employee; all team members can view/move task cards.

-- Replace the old role dropdown and safely move any old Client users to Employee.
do $$
begin
  create type public.user_role_internal as enum ('Owner', 'Management', 'Employee');
exception
  when duplicate_object then null;
end $$;

alter table public.profiles alter column role drop default;
alter table public.profiles
  alter column role type public.user_role_internal
  using (
    case
      when role::text = 'Client' then 'Employee'::public.user_role_internal
      else role::text::public.user_role_internal
    end
  );

drop type if exists public.user_role;
alter type public.user_role_internal rename to user_role;
alter table public.profiles alter column role set default 'Employee'::public.user_role;

-- Remove client-only and personal-task policies.
drop policy if exists "employee_view_own_tasks" on public.tasks;
drop policy if exists "employee_update_own_tasks" on public.tasks;
drop policy if exists "client_view_own_tasks" on public.tasks;
drop policy if exists "client_update_review_stage" on public.tasks;
drop policy if exists "employee_view_all_tasks" on public.tasks;
drop policy if exists "employee_update_all_tasks" on public.tasks;

-- Owners and Management create cards. Every Employee can see the full board
-- and change a card status / move work through the workflow.
create policy "employee_view_all_tasks" on public.tasks
  for select using (public.get_my_role() = 'Employee');

create policy "employee_update_all_tasks" on public.tasks
  for update using (public.get_my_role() = 'Employee')
  with check (public.get_my_role() = 'Employee');
