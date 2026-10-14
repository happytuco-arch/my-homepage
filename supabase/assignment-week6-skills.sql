-- ═════════════════════════════════════════════════════════════
--  과제 한 건 등록 — Skill Creation (WEEK 6)
--
--  붙여넣는 곳 : Supabase → SQL Editor → New query → Run
--  한 번만 실행합니다. (두 번 하면 같은 글이 두 개 생깁니다)
--
--  놓이는 자리
--    목록은 최근에 올린 것이 위입니다. created_at 을 10월 15일로 두어
--    맨 위에 섭니다.
--
--  표지 사진은 사이트에 이미 올라가 있습니다 —
--    /images/week6-skills-cover.png
--    (public/ 에 넣었으므로 npm run build 를 다시 돌려야 dist/ 에도 들어갑니다)
--
--  'HTML 발표 자료' 링크는 Artifact 로 올려 두었습니다. 처음에는 비공개라
--  본인만 열립니다. 그 페이지 오른쪽 위 Share 에서 '링크가 있는 사람'으로
--  바꿔야 다른 사람도 볼 수 있습니다.
-- ═════════════════════════════════════════════════════════════

insert into public.assignments
  (title, course, week, prompt, note, result_url, image_url, attachments, created_at)
values (
  '오픈소스 스킬 5종으로 선행연구 조사하기 — 적용 전후 비교',
  'AI기반 콘텐츠 창업 워크숍',
  'WEEK 6',

  $prompt$A안과 B안에 똑같이 넣은 프롬프트입니다. 한 글자도 바꾸지 않았습니다.

게임 닉네임 연구로 선행연구 조사 발표 PPT를 만들어줘.

아래가 지도교수님이 주신 선행연구 목록이야.

1. Semantic network 방법론 (키워드 간 상관관계 분석)
- Corpus Linguistics, Network Analysis and Co-occurrence Matrices
  (International Journal of English Studies, Univ. of Murcia)
- Omodei, Cointet & Poibeau (2014), LREC'14, pp. 2972-2978

2. 닉네임 사용자명의 형태론/통사/의미론 분석
- GD Usernames and Euphemism: A Morphosemantic Analysis
- Szymanski (2013): 7,456개 닉네임의 형태론 및 문자 선택 동기
- Dubiec-Stach (2021): 독일어·폴란드어 닉네임의 의미·형태·통사·문자 양식 분류
- Kaziaba (2022): 5,000개 사례의 다층위 분석 (온라인 게임 포함)
- Fomin & Chobotar (2022): 게임 내 닉네임의 작명 동기와 생성 기제

연구 방향은 이거야. 선행연구를 기반으로 현재 연구를 진행시키고, LLM 기반 시스템을
만들어 다국어로 발전시킨 뒤, 작명 동기와 행위를 볼 수 있으면 좋겠어.

수업 발표용이고 10장 안쪽이면 좋겠어. pptx 파일로 줘.

─────────────────────────────────────────────

B안에만 적용한 스킬 5종 (전부 깃헙 오픈소스)

im-not-ai (5,984★, MIT)                   한글 AI 티 제거
hallmark (30,048★, MIT)                   디자인 — 구조 다양성, 토큰 고정
paper-search-pro (194★, Apache-2.0)       문헌 검색 (OpenAlex·S2·CrossRef·PubMed·arXiv)
scientific-agent-skills (48,967★, MIT)    인용·BibTeX (citation-management)
frontend-slides (30,489★, MIT)            HTML 슬라이드$prompt$,

  $note$같은 프롬프트를 두 번 돌렸습니다. 한 번은 스킬 없이(A), 한 번은 오픈소스 스킬 5종을 얹어서(B). 달라진 것을 숫자로 남기는 것이 과제의 목적이었습니다.

숫자로 보면 이렇습니다. 다룬 논문 7편 → 18편, 서지정보 확정 1/7 → 6/7, DOI 기재 0건 → 12건. 슬라이드는 A안이 9장 모두 '제목 + 글머리표'였고, B안은 표지·수치 타일·2열 대비·타임라인·표·가로 막대·블록·단계·참고문헌으로 장마다 리듬이 다릅니다.

그런데 분량보다 중요한 일이 하나 있었습니다. A안은 연구 공백으로 '한국어·일본어 등 비유럽 언어는 거의 다뤄지지 않았다'를 들었습니다. 주어진 7편이 폴란드어·독일어·러시아어·우크라이나어뿐이었으니 합리적인 추론이었습니다. 그런데 검색해 보니 틀렸습니다. 스와힐리어(Taji 2024), 응움보어(Kabaso 2016), 중국어(Xu 2020), 페르시아어(2022) 연구가 이미 있었습니다. A안대로 발표했다면 틀린 주장을 했을 것입니다. B안은 공백을 다시 잡았습니다 — 비유럽 언어 연구는 있지만 분류 체계가 제각각이라 서로 포개 볼 수 없고, 한국어와 일본어만 여전히 비어 있습니다.

공백이 하나 더 날카로워졌습니다. A안은 'LLM 자동화가 새롭다'고 했는데, Jaech & Ostendorf(2015, EMNLP, 24회 인용)가 이미 사용자명을 전산적으로 다루고 있었습니다. 다만 나이·성별을 맞히는 쪽이었고 언어학적 분류는 아니었습니다. '자동화가 새롭다'가 아니라 '자동화의 방향이 다르다'로 고쳤습니다.

스킬이 판단을 대신하지는 않았습니다. 설치할 때 넣어 둔 학회 화이트리스트(ICEC·IEEE·CHI PLAY·FDG)로 거르면 128편 중 1편만 남았습니다. 이 주제가 게임 HCI가 아니라 오노마스틱스(인명학) 분야였기 때문입니다 — 주로 실리는 곳은 Names 저널이었습니다. 화이트리스트를 끄기로 한 것, 교수님 목록의 'Fomin & Chobotar (2022)'가 검색에서 'Chobotar (2026)'으로만 잡히는 불일치를 추측으로 메우지 않고 적어 둔 것, Szymanski(2013)를 끝내 못 찾아 미확인으로 남긴 것 — 모두 스킬 밖의 판단이었습니다.

스킬 쪽 문제도 겪었습니다. paper-search-pro 는 OpenAlex API 키가 없으면 중단하라고 되어 있는데 키 없이도 응답이 왔고, frontend-slides 는 '반드시 전문을 포함하라'는 viewport-base.css 가 업스트림 저장소에 아예 없었습니다. 별 3만 개짜리 저장소에도 이런 구멍이 있었습니다.$note$,

  'https://github.com/happytuco-arch/week6_skills_package',
  '/images/week6-skills-cover.png',

  '[
    {"name": "표지 — 선행연구 18편", "url": "/images/week6-skills-cover.png", "type": "image"},
    {"name": "깃헙 저장소 (A/B 전체)", "url": "https://github.com/happytuco-arch/week6_skills_package", "type": "link"},
    {"name": "HTML 발표 자료 — 브라우저에서 바로 보기", "url": "https://claude.ai/artifact/Q3JUswk98mCj9jW5GF7qNW", "type": "link"},
    {"name": "A 프롬프트 (.md)", "url": "https://github.com/happytuco-arch/week6_skills_package/blob/main/A_without_skills/prompt.md", "type": "link"},
    {"name": "B 프롬프트 (.md)", "url": "https://github.com/happytuco-arch/week6_skills_package/blob/main/B_with_skills/prompt.md", "type": "link"},
    {"name": "A/B 비교 기록 (.md)", "url": "https://github.com/happytuco-arch/week6_skills_package/blob/main/COMPARISON.md", "type": "link"},
    {"name": "스킬 묶음 — 출처·라이선스 (.md)", "url": "https://github.com/happytuco-arch/week6_skills_package/blob/main/B_with_skills/skills/ATTRIBUTION.md", "type": "link"},
    {"name": "A 결과물 (.pptx)", "url": "https://github.com/happytuco-arch/week6_skills_package/raw/main/A_without_skills/output/%EC%84%A0%ED%96%89%EC%97%B0%EA%B5%AC%EC%A1%B0%EC%82%AC_%EA%B2%8C%EC%9E%84%EB%8B%89%EB%84%A4%EC%9E%84.pptx", "type": "file"},
    {"name": "B 결과물 (.pptx)", "url": "https://github.com/happytuco-arch/week6_skills_package/raw/main/B_with_skills/output/%EC%84%A0%ED%96%89%EC%97%B0%EA%B5%AC%EC%A1%B0%EC%82%AC_%EA%B2%8C%EC%9E%84%EB%8B%89%EB%84%A4%EC%9E%84_B.pptx", "type": "file"}
  ]'::jsonb,

  '2026-10-15 12:00:00+09'
);


-- 차례가 맞는지 확인 (맨 위에 'WEEK 6' 가 보이면 됩니다)
select week, title, created_at::date as 날짜
from public.assignments
order by created_at desc;
