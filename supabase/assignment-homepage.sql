-- ═════════════════════════════════════════════════════════════
--  과제 제출물 한 건 등록 — 포트폴리오 홈페이지 제작
--
--  붙여넣는 곳 : Supabase → SQL Editor → New query → Run
--  한 번만 실행합니다. (두 번 실행하면 같은 글이 두 개 생깁니다)
--
--  화면 사진 두 장은 이미 사이트에 올라가 있습니다 —
--    /images/homepage-works.png    첫 화면 + Works
--    /images/homepage-article.png  게시물 읽는 화면
-- ═════════════════════════════════════════════════════════════

insert into public.assignments (title, course, week, prompt, note, result_url, image_url, attachments)
values (
  '포트폴리오 홈페이지 제작 — React + Supabase',
  'AI기반 콘텐츠 창업 워크숍 2',
  '개인 프로젝트',

  -- AI 에게 준 프롬프트 원문 (실제로 준 순서대로)
  $prompt$[1] 뼈대 — 무엇을 만들지와, 건드리면 안 되는 것

my-homepage 폴더의 React 포트폴리오 사이트를 수정할 거야.
작업: 관리자 로그인 버튼과, 사진·영상·논문 파일 업로드 버튼을 만들어줘.
주의사항:
- 다른 창에서 public/trailer/ 폴더를 동시에 작업 중이야. public/trailer/ 안의 파일은 절대 건드리지 마.
- src/ 와 index.html 만 수정해줘.
- git commit, git push 는 이 창에서 담당하니까 필요하면 해도 돼.
- 지금은 서버가 없는 정적 사이트라는 점 감안해서 설계해줘.


[2] 자료 — 어디서 읽고, 실패하면 어떻게 말할지까지 지정

지금 포트폴리오에 Supabase를 연결해 줘. @supabase/supabase-js를 설치하고 연결 모듈을 만들어 줘.
.env.local과 값이 비어 있는 .env.example을 준비해 줘. 실제 값은 내가 .env.local에 직접 넣을게.
.gitignore도 만들어서 .env 가 레포지토리에 올라가지 않게 해줘.
변수는 VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_STORAGE_BUCKET을 써 줘.
projects 표의 id, title, description, image_url, video_url, created_at을 읽어 줘.
홈페이지를 열 때 DB에서 작품 데이터를 최신순으로 조회하고, 예시 카드 대신 등록한 작품을 표시해 줘.
작품을 불러오는 중일 때, 등록된 작품이 없을 때, DB 연결에 실패했을 때 각각 다른 한국어 안내 문구를 표시해 줘.
연결 실패를 예시 데이터로 숨기지 마.
방문자는 작품 정보를 조회만 할 수 있게 하고, Supabase 연결에는 비밀키를 사용하지 마.
설정 파일을 편집할 위치와 서버 재시작 방법을 쉬운 말로 알려 줘.


[3] 권한 — 누가 무엇을 할 수 있는지를 한 줄씩

내 포트폴리오에 Supabase Auth 관리자 로그인을 추가해 줘. 관리자 UID: [내 UID]
이 사용자 한 명만 작품을 등록, 수정, 삭제하게 해 줘. 기존 projects 표와 공개 읽기는 유지해 줘.
쓰기 권한과 RLS를 추가하되 INSERT, UPDATE, DELETE마다 이 UID를 검사해 줘.
UPDATE는 기존 행과 새 값 모두 검사해 줘.
Storage도 portfolio-media의 images/·videos/ 경로에서 같은 관리자만 쓰게 해 줘.
비밀번호는 로그인 폼에서 받고 secret·service_role 키는 사용하지 마.
파일 업로드가 완료되면 파일 주소를 해당 작품의 행에 저장해 줘.
업로드나 작품 정보 저장에 실패하면 사용자가 입력한 내용을 유지해 줘.
필요한 SQL과 적용 위치를 쉬운 말로 먼저 설명해 줘. 기존 데이터는 지우지 말고 빌드와 권한 검사를 해 줘.$prompt$,

  -- 짧은 메모
  $note$작품·논문·과제를 한 곳에 모아 두는 포트폴리오 사이트입니다. React + Vite 로 만들고 Supabase 에 자료를 두었으며 Vercel 로 배포했습니다.

프롬프트를 한 번에 길게 쓰지 않고 세 번에 나눠 주었습니다. 뼈대 → 자료 → 권한 순서입니다. 각 단계에서 "무엇을 만들지"보다 "무엇을 건드리면 안 되는지"와 "실패했을 때 어떻게 말할지"를 먼저 적었습니다.

그 결과로 받은 것 중 세 가지가 기억할 만합니다.
첫째, 연결이 끊겼을 때 예시 자료로 화면을 채우지 않습니다. 화면이 멀쩡해 보이면 끊긴 것을 눈치채지 못하기 때문입니다. 불러오는 중·등록된 작품 없음·연결 실패를 각각 다르게 알립니다.
둘째, 비밀 열쇠가 설정에 들어오면 코드가 연결 자체를 거부합니다. 정적 사이트라 열쇠가 방문자에게 그대로 보이기 때문입니다. 실제 보호는 Supabase 쪽 RLS 규칙이 맡고, 등록·수정·삭제마다 관리자 UID 를 검사합니다.
셋째, 작품·논문·과제는 칸 이름이 전부 다르지만 읽는 화면은 하나뿐입니다. 어댑터 한 곳에서 공통 모양으로 옮겨 담습니다. 읽는 사람에게는 셋 다 그냥 글이기 때문입니다.

막힌 곳도 기록해 둡니다. 익명 등록이 거부되던 일은 RLS 가 아니라 그 앞단의 GRANT 문제였고, 긴 글이 통째로 사라지던 일은 드러나는 애니메이션이 "구역의 35%가 보일 때"를 조건으로 삼아 글이 길어지면 그 조건이 영영 채워지지 않아서였습니다.$note$,

  'https://my-homepage-pi-wheat.vercel.app/',
  '/images/homepage-works.png',

  '[
    {"name": "첫 화면과 Works", "url": "/images/homepage-works.png", "type": "image"},
    {"name": "게시물 읽는 화면", "url": "/images/homepage-article.png", "type": "image"}
  ]'::jsonb
);
