-- ═════════════════════════════════════════════════════════════
--  과제 한 건 등록 — Week 8 Figma 레이아웃 + Claude Code 플러그인 연결
--
--  붙여넣는 곳 : Supabase → SQL Editor → New query → Run
--  한 번만 실행합니다. 맨 끝 UPDATE 가 \r 를 자동으로 지웁니다.
-- ═════════════════════════════════════════════════════════════

insert into public.assignments
  (title, course, week, prompt, note, result_url, image_url, attachments)
values (
  '포트폴리오 사이트를 Figma 레이아웃으로 — Claude Code 플러그인 연결',
  'AI기반 콘텐츠 창업 워크숍',
  'WEEK 8',

  $prompt$Claude Code 에 준 프롬프트 — 네 번

[1] 연결

클로드 코드에 피그마를 플러그인으로 연결하는 법 알려주고,
요금제와 상관없이 수동으로 연결할 수 있는 방법도 알려줘.


[2] 사진이 아니라 레이어로  ← 이번 과제의 핵심

피그마에 지금 나의 홈페이지 화면이 사진으로 올라가 있는데,
피그마 내에서 사진 내의 UI 등의 요소들이
하나하나 레이아웃으로서 수정 가능하게 되어야 해.


[3] 폭별 버전과 구역 묶기

데스크톱 1440 을 아이패드 820 · 모바일 390 으로 복제하고,
글자 크기와 여백만 폭에 맞게 줄여줘.
셋을 "04 사이트 화면" 섹션으로 묶고,
기존 01~03 섹션과 같은 간격·위치 규칙을 따라줘.


[4] 로고

홈페이지 로고를 이미지로 생성해줘.
게임 디자인·연구 포트폴리오의 미니멀 로고 마크.
J 와 H 를 하나의 가는 선으로 이은 기하학적 모노그램,
near-black(#111110) 선, warm off-white(#FAF9F7) 배경.
그라데이션·그림자·3D·테두리 없이 평면 벡터 느낌으로.
글자나 태그라인은 넣지 마.$prompt$,

  $note$지난주에는 추상 그래픽으로 레이아웃 '도안'을 만들었다면, 이번에는 실제로 돌아가는 포트폴리오 사이트를 Figma 안에 편집 가능한 레이어로 옮겼습니다. Claude Code 를 Figma 에 플러그인(MCP)으로 연결해서 작업했습니다.

가장 중요한 판단은 "사진을 레이어로 바꾸려 하지 않은 것"입니다. 캡처 이미지는 픽셀 덩어리라 아무리 해도 쪼개지지 않습니다. 대신 실행 중인 사이트에서 디자인 토큰을 직접 읽어 Figma 에 다시 그렸습니다. 배경 #FAF9F7, 상단바 #272623, 글자 #111110 과 #55524D, 본문 Source Sans 3, 메뉴 IBM Plex Mono 10px 자간 2.6, 제목 Source Serif 4 — 전부 사이트의 실제 값입니다. 세 글꼴 모두 Figma 에 있어서 화면이 거의 그대로 재현됐습니다.

결과물은 63개 레이어입니다. 상단바 · 로고 · 메뉴 네 개 · 머리글 · 제목 · 명세표 세 행이 각각 따로 잡히고, 색과 여백은 숫자로 조정됩니다. 폭에 따라 제목이 64 → 48 → 32px, 좌우 여백이 80 → 48 → 20px 로 달라집니다.

막혔던 곳도 적어 둡니다. 제 Figma 는 무료(Starter) 플랜에 View 좌석이라 "쓰기는 Professional 이상이어야 한다"는 자료가 많았습니다. 그런데 실제로 호출해 보니 읽기도 쓰기도 됐습니다. 문서만 보고 포기하지 않고 한 번 붙여 본 것이 맞았습니다.

브로슈어는 사람 소개가 아니라 사이트를 중심으로 다시 짰습니다. 사이트 화면 축소본을 붙이고, 네 갈래 구성(Works · Papers · Assignments · About)과 사용 기술(React · Vite · Supabase · Vercel)을 넣었습니다. 로고는 Figma 의 이미지 생성으로 뽑은 JH 모노그램입니다.$note$,

  'https://www.figma.com/design/qXUZkLMT9F3yIu1NiBKM0x/%EB%9E%9C%EB%94%A9%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%94%94%EC%9E%90%EC%9D%B8-%EB%A0%88%EC%9D%B4%EC%95%84%EC%9B%83?node-id=0-1',
  null,

  '[
    {"name": "Figma — 사이트 화면 3종 (데스크톱 · 아이패드 · 모바일)", "url": "/images/week8-figma-screens.png", "type": "image"},
    {"name": "브로슈어 1장", "url": "/images/week8-brochure.png", "type": "image"},
    {"name": "홈페이지 로고 (생성 이미지)", "url": "/images/week8-logo.png", "type": "image"},
    {"name": "명함 앞면", "url": "/images/week7-card-front.png", "type": "image"},
    {"name": "명함 뒷면", "url": "/images/week7-card-back.png", "type": "image"},
    {"name": "포트폴리오 브로슈어 (PDF)", "url": "/files/week8-brochure.pdf", "type": "file"},
    {"name": "figma 주소 링크", "url": "https://www.figma.com/design/qXUZkLMT9F3yIu1NiBKM0x/%EB%9E%9C%EB%94%A9%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%94%94%EC%9E%90%EC%9D%B8-%EB%A0%88%EC%9D%B4%EC%95%84%EC%9B%83?node-id=0-1", "type": "link"}
  ]'::jsonb
);

-- 붙여넣기로 섞여 들어간 \r 를 바로 정리합니다
update public.assignments
set prompt = replace(prompt, chr(13), ''),
    note   = replace(note,   chr(13), '')
where week = 'WEEK 8';

-- 확인 — 맨 위가 WEEK 8, 첨부 7개, CR 0 이면 끝입니다
select week, title,
       jsonb_array_length(attachments) as 첨부,
       length(note) - length(replace(note, chr(13), '')) as 소개_CR
from public.assignments
order by created_at desc;
