-- ═════════════════════════════════════════════════════════════
--  과제 제출물(assignments) 표 만들기 + 권한 잠그기
--
--  붙여넣는 곳 : Supabase → SQL Editor → New query → Run
--  한 번만 실행하면 됩니다. 여러 번 실행해도 안전합니다.
--
--  ⚠️ 기존 projects · papers 표와 데이터는 건드리지 않습니다.
--
--  관리자 UID : 8cac450f-eb26-4123-af63-d88e202639ff
-- ═════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────
--  1부. 표 만들기
--
--  칸 설명
--    title       과제 이름
--    course      수업 이름 (비워 둬도 됩니다)
--    week        몇 주차 · 과제 번호
--    prompt      AI 에게 준 프롬프트 원문 (이 표의 핵심입니다)
--    note        무엇을 의도했고 무엇이 나왔는지 짧은 메모
--    result_url  결과물 주소 (배포 링크 · 깃헙 등)
--    image_url   결과 화면 사진
--    attachments 올려 둔 프로젝트물 목록 (여러 개)
--                [{ name, url, type }] 모양으로 담깁니다
--    created_at  등록 시각
-- ─────────────────────────────────────────────────────────────

create table if not exists public.assignments (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  course      text,
  week        text,
  prompt      text,
  note        text,
  result_url  text,
  image_url   text,
  attachments jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);


-- ─────────────────────────────────────────────────────────────
--  2부. 출입증(grant) — 읽기는 누구나, 쓰기는 로그인한 사람만
-- ─────────────────────────────────────────────────────────────

grant select on public.assignments to anon, authenticated;
grant insert, update, delete on public.assignments to authenticated;


-- ─────────────────────────────────────────────────────────────
--  3부. 방 열쇠(RLS) — 등록·수정·삭제는 관리자 UID 한 명만
-- ─────────────────────────────────────────────────────────────

alter table public.assignments enable row level security;

drop policy if exists "assignments_select_public" on public.assignments;
drop policy if exists "assignments_insert_admin" on public.assignments;
drop policy if exists "assignments_update_admin" on public.assignments;
drop policy if exists "assignments_delete_admin" on public.assignments;

create policy "assignments_select_public"
  on public.assignments
  for select
  to anon, authenticated
  using (true);

create policy "assignments_insert_admin"
  on public.assignments
  for insert
  to authenticated
  with check ( auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid );

-- 수정은 기존 줄(using)과 고친 결과(with check) 양쪽을 검사합니다
create policy "assignments_update_admin"
  on public.assignments
  for update
  to authenticated
  using      ( auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid )
  with check ( auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid );

create policy "assignments_delete_admin"
  on public.assignments
  for delete
  to authenticated
  using ( auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid );


-- ─────────────────────────────────────────────────────────────
--  4부. Storage — 과제 파일을 넣을 assignments/ 칸 허용
--       (images/ videos/ papers/ 는 그대로 유지됩니다)
-- ─────────────────────────────────────────────────────────────

drop policy if exists "media_insert_admin" on storage.objects;
drop policy if exists "media_update_admin" on storage.objects;
drop policy if exists "media_delete_admin" on storage.objects;

create policy "media_insert_admin"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('images', 'videos', 'papers', 'assignments')
    and auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid
  );

create policy "media_update_admin"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('images', 'videos', 'papers', 'assignments')
    and auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid
  )
  with check (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('images', 'videos', 'papers', 'assignments')
    and auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid
  );

create policy "media_delete_admin"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('images', 'videos', 'papers', 'assignments')
    and auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid
  );


-- ─────────────────────────────────────────────────────────────
--  5부. 확인 — assignments 4줄, papers 4줄, projects 4줄, objects 4줄
-- ─────────────────────────────────────────────────────────────

select tablename, policyname, cmd
from pg_policies
where (schemaname = 'public'  and tablename in ('assignments', 'papers', 'projects'))
   or (schemaname = 'storage' and tablename = 'objects')
order by tablename, cmd, policyname;
