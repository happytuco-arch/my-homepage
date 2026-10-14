-- ═════════════════════════════════════════════════════════════
--  Week 4 과제 글에 게임 결과물 추가
--  '다른 사람의 CLAUDE.md로 게임 만들어보고 보완하기'
--
--  붙여넣는 곳 : Supabase → SQL Editor → New query → Run
--
--  왜 고치나
--    지금 첨부가 .md 문서 셋뿐이라 '프롬프트를 정리한 과제'처럼만 보입니다.
--    정작 그 프롬프트로 만든 게임이 빠져 있었습니다.
--    이윤호.html 을 저장소에 올렸으니 바로 플레이할 수 있는 링크를 넣습니다.
--
--  하는 일
--    1) 첨부 맨 앞에 '게임 바로 하기' 를 넣고, 소스 보기도 함께 답니다
--    2) result_url 을 .md 문서에서 게임으로 바꿉니다
--       (목록의 '결과물 보기' 버튼이 게임으로 가게 됩니다)
--
--  여러 번 실행해도 안전합니다 — 이미 들어 있으면 건너뜁니다.
-- ═════════════════════════════════════════════════════════════

update public.assignments
set
  result_url = 'https://coffee-delivery-game-week3-gamma.vercel.app/%EC%9D%B4%EC%9C%A4%ED%98%B8.html',

  attachments =
    '[
      {"name": "게임 바로 하기 — 달동네 커피 (이윤호.html)", "url": "https://coffee-delivery-game-week3-gamma.vercel.app/%EC%9D%B4%EC%9C%A4%ED%98%B8.html", "type": "link"},
      {"name": "게임 소스 보기 (이윤호.html)", "url": "https://github.com/happytuco-arch/coffee-delivery-game-week3/blob/main/%EC%9D%B4%EC%9C%A4%ED%98%B8.html", "type": "link"}
    ]'::jsonb || coalesce(attachments, '[]'::jsonb)

where id = '1c8d17bc-d24f-4f85-acad-af55ab58af30'
  and not (attachments::text like '%이윤호.html%');   -- 이미 넣었으면 건드리지 않음


-- 결과 확인 (첨부가 5개가 되고 맨 위가 '게임 바로 하기' 면 됩니다)
select
  week,
  title,
  result_url,
  jsonb_array_length(attachments) as 첨부수,
  jsonb_path_query_array(attachments, '$[*].name') as 첨부목록
from public.assignments
where id = '1c8d17bc-d24f-4f85-acad-af55ab58af30';
