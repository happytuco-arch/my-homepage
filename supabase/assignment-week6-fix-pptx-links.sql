-- ═════════════════════════════════════════════════════════════
--  WEEK 6 과제 글 — pptx 첨부 주소 고치기
--
--  붙여넣는 곳 : Supabase → SQL Editor → New query → Run
--
--  왜 고치나
--    깃헙 레포에서 결과물 pptx 를 output/ 폴더 밖으로 꺼냈습니다.
--    (폴더를 한 번 더 눌러야 결과물이 보이던 것을 없앴습니다)
--    그 바람에 첨부에 걸어 둔 두 주소가 404 가 됐습니다.
--
--      옛 주소  .../A_without_skills/output/선행연구조사_게임닉네임.pptx   → 404
--      새 주소  .../A_without_skills/선행연구조사_게임닉네임.pptx          → 200
--
--  하는 일
--    attachments 안의 '/output/' 를 '/' 로 바꿉니다. 다른 첨부는 건드리지 않습니다.
--
--  여러 번 실행해도 안전합니다 — 바꿀 것이 없으면 아무 일도 하지 않습니다.
-- ═════════════════════════════════════════════════════════════

update public.assignments
set attachments = replace(attachments::text, '/output/', '/')::jsonb
where week = 'WEEK 6'
  and attachments::text like '%/output/%';


-- 결과 확인 — '남은 output' 이 0 이면 됩니다
select
  week,
  jsonb_array_length(attachments) as 첨부수,
  (length(attachments::text) - length(replace(attachments::text, '/output/', ''))) / 8
    as 남은_output,
  jsonb_path_query_array(attachments, '$[*].name') as 첨부목록
from public.assignments
where week = 'WEEK 6';
