-- ═════════════════════════════════════════════════════════════
--  논문(papers) 표 만들기 + 권한 잠그기
--
--  붙여넣는 곳 : Supabase → SQL Editor → New query → Run
--  한 번만 실행하면 됩니다. 여러 번 실행해도 안전합니다.
--
--  ⚠️ 기존 projects 표와 작품 데이터는 전혀 건드리지 않습니다.
--
--  관리자 UID : 8cac450f-eb26-4123-af63-d88e202639ff
-- ═════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────
--  1부. 표 만들기
--
--  칸 설명
--    title      논문 제목
--    authors    저자 (쉼표로 이어 적습니다)
--    venue      실린 학술지 · 학회
--    year       연도
--    doi        DOI 번호
--    link       원문 주소
--    pdf_url    올려 둔 PDF 파일 주소 (없어도 됩니다)
--    abstract   초록 원문
--    summary    내가 붙이는 한 줄 설명
--    takeaways  이 프로젝트가 받아들인 관점 (줄바꿈으로 여러 개)
--    keywords   키워드 (쉼표로 이어 적습니다)
--    citations  인용 횟수
-- ─────────────────────────────────────────────────────────────

create table if not exists public.papers (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  authors     text,
  venue       text,
  year        text,
  doi         text,
  link        text,
  pdf_url     text,
  abstract    text,
  summary     text,
  takeaways   text,
  keywords    text,
  citations   integer,
  created_at  timestamptz not null default now()
);


-- ─────────────────────────────────────────────────────────────
--  2부. 출입증(grant) — 읽기는 누구나, 쓰기는 로그인한 사람만
-- ─────────────────────────────────────────────────────────────

grant select on public.papers to anon, authenticated;
grant insert, update, delete on public.papers to authenticated;


-- ─────────────────────────────────────────────────────────────
--  3부. 방 열쇠(RLS) — 등록·수정·삭제는 관리자 UID 한 명만
-- ─────────────────────────────────────────────────────────────

alter table public.papers enable row level security;

drop policy if exists "papers_select_public" on public.papers;
drop policy if exists "papers_insert_admin" on public.papers;
drop policy if exists "papers_update_admin" on public.papers;
drop policy if exists "papers_delete_admin" on public.papers;

create policy "papers_select_public"
  on public.papers
  for select
  to anon, authenticated
  using (true);

create policy "papers_insert_admin"
  on public.papers
  for insert
  to authenticated
  with check ( auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid );

-- 수정은 기존 줄(using)과 고친 결과(with check) 양쪽을 검사합니다
create policy "papers_update_admin"
  on public.papers
  for update
  to authenticated
  using      ( auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid )
  with check ( auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid );

create policy "papers_delete_admin"
  on public.papers
  for delete
  to authenticated
  using ( auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid );


-- ─────────────────────────────────────────────────────────────
--  4부. Storage — PDF 를 넣을 papers/ 칸을 새로 허용합니다
--
--  기존 규칙은 images/ 와 videos/ 두 곳만 허용하고 있어서,
--  PDF 를 올리려면 목록에 papers/ 를 더해 주어야 합니다.
--  (아래는 기존 규칙을 지우고 같은 내용에 papers/ 만 추가해 다시 만듭니다)
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
    and (storage.foldername(name))[1] in ('images', 'videos', 'papers')
    and auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid
  );

create policy "media_update_admin"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('images', 'videos', 'papers')
    and auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid
  )
  with check (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('images', 'videos', 'papers')
    and auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid
  );

create policy "media_delete_admin"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('images', 'videos', 'papers')
    and auth.uid() = '8cac450f-eb26-4123-af63-d88e202639ff'::uuid
  );


-- ─────────────────────────────────────────────────────────────
--  5부. 확인 — papers 4줄, objects 4줄이 보이면 됩니다
-- ─────────────────────────────────────────────────────────────

select tablename, policyname, cmd
from pg_policies
where (schemaname = 'public'  and tablename in ('papers', 'projects'))
   or (schemaname = 'storage' and tablename = 'objects')
order by tablename, cmd, policyname;
