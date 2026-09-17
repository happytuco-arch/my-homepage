-- ═════════════════════════════════════════════════════════════
--  관리자 한 명만 작품을 등록·수정·삭제할 수 있게 잠그는 설정
--
--  붙여넣는 곳 : Supabase → SQL Editor → New query → Run
--  한 번만 실행하면 됩니다. 여러 번 실행해도 안전합니다.
--
--  ⚠️ 이 파일에는 데이터를 지우는 명령이 없습니다.
--     기존 projects 표의 내용은 그대로 남습니다.
--
--  관리자 UID : 8cac450f-eb26-4123-af63-d88e202639ff
--  (Supabase → Authentication → Users 에서 확인한 값)
-- ═════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────
--  0부. 문을 열어 두기 (grant)
--
--  Postgres 에는 자물쇠가 두 겹 있습니다.
--    ① grant  — "이 역할이 이 표를 건드릴 수 있는가" (건물 출입증)
--    ② RLS    — "건드릴 수 있다면, 어느 줄까지인가"   (방 열쇠)
--
--  출입증이 없으면 방 열쇠가 있어도 못 들어갑니다.
--  지금 이 프로젝트는 anon 에게 조회만 허용돼 있고 쓰기 출입증이 없는 상태라,
--  로그인한 관리자(authenticated)에게 쓰기 출입증을 명시적으로 내어 줍니다.
--
--  "그럼 로그인한 사람은 다 쓸 수 있는 것 아닌가?" 아닙니다.
--  출입증을 받아도 아래 1부의 RLS 가 UID 를 다시 검사하므로,
--  관리자 UID 가 아니면 한 줄도 넣거나 고칠 수 없습니다.
-- ─────────────────────────────────────────────────────────────

grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;


-- ─────────────────────────────────────────────────────────────
--  1부. projects 표 — 읽기는 누구나, 쓰기는 관리자만
-- ─────────────────────────────────────────────────────────────

-- 자물쇠를 켭니다.
-- 이걸 켜면 "허락한 것 말고는 전부 금지"가 되어, 아래에서 적어 주는
-- 규칙에 해당하지 않는 모든 접근이 막힙니다.
alter table public.projects enable row level security;

-- 같은 이름의 규칙이 이미 있으면 새로 만들 수 없어서, 먼저 지우고 다시 만듭니다.
-- (규칙만 지우는 것이지 데이터는 건드리지 않습니다)
drop policy if exists "projects_select_public" on public.projects;
drop policy if exists "projects_insert_admin" on public.projects;
drop policy if exists "projects_update_admin" on public.projects;
drop policy if exists "projects_delete_admin" on public.projects;


-- (1) 조회 — 누구나 볼 수 있습니다. 로그인하지 않은 방문자(anon) 포함.
create policy "projects_select_public"
  on public.projects
  for select
  to anon, authenticated
  using (true);


-- (2) 등록 — 관리자 UID 로 로그인한 사람만.
--     with check = "새로 들어올 줄이 이 조건을 만족해야 한다"
create policy "projects_insert_admin"
  on public.projects
  for insert
  to authenticated
  with check ( auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid );


-- (3) 수정 — 기존 줄과 새 값 양쪽을 모두 검사합니다.
--
--     using      = "고치려는 '기존 줄'이 이 조건을 만족해야 한다"
--                  → 조건에 안 맞으면 그 줄이 아예 안 보여서 손댈 수 없습니다
--     with check = "고친 '결과 값'도 이 조건을 만족해야 한다"
--                  → 고치는 도중에 남의 것으로 바꿔치기하는 것을 막습니다
--
--     둘 중 하나만 쓰면 한쪽이 뚫리므로 반드시 같이 적습니다.
create policy "projects_update_admin"
  on public.projects
  for update
  to authenticated
  using      ( auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid )
  with check ( auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid );


-- (4) 삭제 — 관리자만.
create policy "projects_delete_admin"
  on public.projects
  for delete
  to authenticated
  using ( auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid );


-- ─────────────────────────────────────────────────────────────
--  2부. Storage — portfolio-media 통의 images/ · videos/ 칸
--
--  올려 둔 파일 목록은 storage.objects 라는 표에 들어갑니다.
--  그래서 파일 권한도 표 규칙과 똑같은 방식으로 잠급니다.
--
--  ※ 먼저 Storage 화면에서 portfolio-media 통을 만들어 두세요.
--    사진·영상이 방문자에게 보이려면 Public 통이어야 합니다.
-- ─────────────────────────────────────────────────────────────

drop policy if exists "media_select_public" on storage.objects;
drop policy if exists "media_insert_admin" on storage.objects;
drop policy if exists "media_update_admin" on storage.objects;
drop policy if exists "media_delete_admin" on storage.objects;


-- (1) 파일 보기 — 누구나.
create policy "media_select_public"
  on storage.objects
  for select
  to anon, authenticated
  using ( bucket_id = 'portfolio-media' );


-- (2) 파일 올리기 — 관리자만, 그리고 images/ 또는 videos/ 칸에만.
--
--     storage.foldername(name) 은 파일 경로를 폴더 단위로 쪼갠 목록입니다.
--     예) 'images/2026-cat.png'  →  {images}  이므로 [1] 은 'images'
create policy "media_insert_admin"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('images', 'videos')
    and auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid
  );


-- (3) 파일 덮어쓰기 — 관리자만. 표와 마찬가지로 양쪽을 검사합니다.
create policy "media_update_admin"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('images', 'videos')
    and auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid
  )
  with check (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('images', 'videos')
    and auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid
  );


-- (4) 파일 지우기 — 관리자만.
create policy "media_delete_admin"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('images', 'videos')
    and auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid
  );


-- ─────────────────────────────────────────────────────────────
--  3부. 잘 걸렸는지 확인 (실행하면 규칙 목록이 나옵니다)
-- ─────────────────────────────────────────────────────────────

-- 규칙 목록
select tablename, policyname, cmd
from pg_policies
where (schemaname = 'public'  and tablename = 'projects')
   or (schemaname = 'storage' and tablename = 'objects')
order by tablename, cmd, policyname;

-- 출입증 목록 — authenticated 에 INSERT/UPDATE/DELETE 가 보여야 합니다
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name = 'projects'
  and grantee in ('anon', 'authenticated')
order by grantee, privilege_type;
