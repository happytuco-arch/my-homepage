-- ═════════════════════════════════════════════════════════════
--  커피 배달 게임 글 — 게임 화면을 아래 사진 묶음으로 내리기
--
--  지금은 '게임 화면'이 글 오른쪽 표지 자리에 혼자 있고,
--  '게임 방법'만 아래에 있습니다. 둘을 아래에 나란히 놓습니다.
--
--    image_url   비웁니다 → 오른쪽 표지가 사라집니다
--    attachments 게임 화면을 게임 방법 앞에 넣습니다 → 둘이 한 줄에 섭니다
--
--  ※ 과제 목록 카드는 사진을 쓰지 않으므로 표지를 내려도 목록은 그대로입니다.
--
--  붙여넣는 곳 : Supabase → SQL Editor → New query → Run
--  여러 번 실행해도 안전합니다.
-- ═════════════════════════════════════════════════════════════

update public.assignments
set
  image_url = null,
  attachments = '[
    {"name": "게임 화면 — 작은 행성과 달동네 커피", "url": "/images/coffee-game-play.png",  "type": "image"},
    {"name": "게임 방법",                            "url": "/images/coffee-game-howto.png", "type": "image"},
    {"name": "게임 열기 (after)", "url": "https://coffee-delivery-game-week3-jh-f22e.vercel.app/after/index.html", "type": "link"},
    {"name": "깃헙 저장소",       "url": "https://github.com/happytuco-arch/coffee-delivery-game-week3",           "type": "link"}
  ]'::jsonb
where title like '커피 배달 게임%';


-- 확인 — image_url 이 비고 첨부가 4개면 됩니다
select title, image_url, jsonb_array_length(attachments) as 첨부개수
from public.assignments
where title like '커피 배달 게임%';
