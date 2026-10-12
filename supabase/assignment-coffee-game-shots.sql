-- ═════════════════════════════════════════════════════════════
--  커피 배달 게임 글 — 프롬프트 빼고, 플레이 사진 두 장 더
--
--  ① prompt 를 비웁니다 → 글에서 프롬프트 블록이 사라집니다
--  ② 사진을 넷으로 늘립니다
--       게임 화면 · 배달 성공 · UFO 공격 · 게임 방법
--
--  붙여넣는 곳 : Supabase → SQL Editor → New query → Run
--  여러 번 실행해도 안전합니다.
-- ═════════════════════════════════════════════════════════════

update public.assignments
set
  prompt = null,
  attachments = '[
    {"name": "게임 화면 — 작은 행성과 달동네 커피",      "url": "/images/coffee-game-play.png",     "type": "image"},
    {"name": "배달 성공 — 봄날책방에 첫 잔을 전하고",    "url": "/images/coffee-game-delivery.jpg", "type": "image"},
    {"name": "UFO 의 공격 — 별이 떨어지고 하트가 하나 줄었다", "url": "/images/coffee-game-hazard.jpg", "type": "image"},
    {"name": "게임 방법",                                 "url": "/images/coffee-game-howto.png",    "type": "image"},
    {"name": "게임 열기 (after)", "url": "https://coffee-delivery-game-week3-jh-f22e.vercel.app/after/index.html", "type": "link"},
    {"name": "깃헙 저장소",       "url": "https://github.com/happytuco-arch/coffee-delivery-game-week3",           "type": "link"}
  ]'::jsonb
where title like '커피 배달 게임%';


-- 확인 — prompt 가 비고 첨부가 6개(사진 4 + 링크 2)면 됩니다
select title, prompt is null as 프롬프트없음, jsonb_array_length(attachments) as 첨부개수
from public.assignments
where title like '커피 배달 게임%';
