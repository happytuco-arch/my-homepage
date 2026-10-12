-- ═════════════════════════════════════════════════════════════
--  커피 배달 게임 글 — 두 군데 다듬기
--
--  ① \r 지우기
--     SQL 편집기에 붙여넣을 때 줄바꿈이 CRLF 로 들어가, 글 안에
--     보이지 않는 \r 이 열여덟 개 섞였습니다. (소개 8, 프롬프트 10)
--  ② 표지 사진이 아래 사진 묶음에 또 나오던 것 — 중복 한 장 빼기
--
--  붙여넣는 곳 : Supabase → SQL Editor → New query → Run
--  여러 번 실행해도 안전합니다.
-- ═════════════════════════════════════════════════════════════

update public.assignments
set
  prompt = replace(prompt, chr(13), ''),
  note   = replace(note,   chr(13), ''),
  attachments = '[
    {"name": "게임 방법",         "url": "/images/coffee-game-howto.png", "type": "image"},
    {"name": "게임 열기 (after)", "url": "https://coffee-delivery-game-week3-jh-f22e.vercel.app/after/index.html", "type": "link"},
    {"name": "깃헙 저장소",       "url": "https://github.com/happytuco-arch/coffee-delivery-game-week3",           "type": "link"}
  ]'::jsonb
where title like '커피 배달 게임%';


-- 확인 — 남은 \r 개수가 0 이면 끝입니다
select title,
       length(prompt) - length(replace(prompt, chr(13), '')) as 프롬프트_CR,
       length(note)   - length(replace(note,   chr(13), '')) as 소개_CR,
       jsonb_array_length(attachments)                       as 첨부개수
from public.assignments
where title like '커피 배달 게임%';
