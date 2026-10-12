-- ═════════════════════════════════════════════════════════════
--  커피 배달 게임 과제에 화면 사진 두 장 붙이기
--
--  붙여넣는 곳 : Supabase → SQL Editor → New query → Run
--  한 번만 실행합니다.
--
--  · 새 글을 만들지 않고, 이미 올라가 있는 WEEK 3 과제를 고칩니다.
--  · 결과물 주소(result_url)와 기존 자료 링크 다섯 개는 그대로 둡니다.
--    attachments 에 '덮어쓰기'가 아니라 '이어붙이기'(||)를 씁니다.
--
--  사진은 이미 사이트에 올라가 있습니다 —
--    /images/coffee-game-play.png    게임 화면 (행성 · 카페 · 배달 상태)
--    /images/coffee-game-howto.png   게임 방법 안내
-- ═════════════════════════════════════════════════════════════

update public.assignments
set
  image_url = '/images/coffee-game-play.png',
  attachments = attachments || '[
    {"name": "게임 화면 — 작은 행성과 Little Cafe", "url": "/images/coffee-game-play.png",  "type": "image"},
    {"name": "게임 방법 안내",                      "url": "/images/coffee-game-howto.png", "type": "image"}
  ]'::jsonb
where title like '프롬프트 구조화 실습%';


-- 제대로 들어갔는지 확인 (1줄이 나오고 사진 두 장이 보이면 끝입니다)
select title,
       image_url,
       jsonb_array_length(attachments) as 첨부개수
from public.assignments
where title like '프롬프트 구조화 실습%';
