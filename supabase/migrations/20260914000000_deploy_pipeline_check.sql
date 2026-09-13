-- Harmless, idempotent marker migration used solely to confirm that
-- pushing to supabase/migrations/ on main actually reaches the live
-- database (via the native Supabase-GitHub integration and/or the
-- supabase-migrations.yml CI workflow). Safe to leave in place permanently.
comment on table public.admins is 'Deploy pipeline verification check — confirms supabase/migrations/ changes on main reach this project.';
