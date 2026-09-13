-- Let admins read any file in the licences bucket (not just their own),
-- so the admin review screen can open a submitted resale certificate.
drop policy if exists "admins can read every licence file" on storage.objects;
create policy "admins can read every licence file"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'smoke-wholesale-licenses'
    and exists (select 1 from public.admins where user_id = auth.uid())
  );
