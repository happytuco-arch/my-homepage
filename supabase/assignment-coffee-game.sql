-- ═════════════════════════════════════════════════════════════
--  과제 한 건 등록 — 커피 배달 게임 (완성본)
--
--  붙여넣는 곳 : Supabase → SQL Editor → New query → Run
--  한 번만 실행합니다. (두 번 하면 같은 글이 두 개 생깁니다)
--
--  놓이는 자리
--    목록은 최근에 올린 것이 위입니다. created_at 을 10월 5일로 두어
--    '프롬프트 구조화 실습'(10/1)과 '시스템 프롬프트'(10/8) 사이에 섭니다.
--
--  사진 두 장은 이미 사이트에 올라가 있습니다 —
--    /images/coffee-game-play.png    게임 화면
--    /images/coffee-game-howto.png   게임 방법
-- ═════════════════════════════════════════════════════════════

insert into public.assignments
  (title, course, week, prompt, note, result_url, image_url, attachments, created_at)
values (
  '커피 배달 게임 — 완성본',
  'AI기반 콘텐츠 창업 워크숍',
  'WEEK 3',

  $prompt$[고정층] 이 게임의 불변 조건 — 매 요청에 함께 붙인 규칙

1. HTML 파일 하나로 실행한다. 파일을 나누지 않는다.
2. 외부 라이브러리·API·폰트·이미지·음원을 쓰지 않는다. 외부 요청이 0이어야 한다.
   그림은 코드로 그리고, 소리는 Web Audio 로 합성한다.
3. 60프레임을 유지한다. 그리는 양을 늘렸으면 얼마나 늘었는지 숫자로 보고한다.
4. 요청하지 않은 것은 바꾸지 않는다. (디자인 요청에 게임 수치를 같이 바꾸지 않는다)
5. 숫자로 지정된 값(제한 시간, 데미지, 하트 개수 등)은 이름 붙인 상수로 만든다.
   흩어 쓰지 않는다.
6. 고친 뒤 after/tests/ 를 돌려 통과 수를 보고하고, 새 규칙을 만들었으면
   그 규칙의 테스트도 함께 추가한다.$prompt$,

  $note$작은 행성 위의 달동네를 걸어 다니며 커피를 배달하는 게임입니다. HTML 파일 하나로 돌아가고, 외부 요청이 하나도 없습니다. 그림은 전부 코드로 그렸고 소리는 Web Audio 로 합성했습니다.

놀이 방법 — 달동네 커피(Little Cafe)에서 커피를 받아 여섯 곳에 전합니다. 봄날책방에 따뜻한 아메리카노, 우리슈퍼에 아이스 라테, 보송세탁소에 디카페인 라테, 달빛정자에 따뜻한 보리 라테, 그리고 꽃담집과 언덕집. 주문처가 행성 반대편과 남쪽까지 퍼져 있어서, 한 바퀴를 다 돌아야 끝납니다.

방해가 셋 있습니다. 외계인 아홉이 가까이 오면 달려들고, 바닥의 흰색 원판 열한 개는 밟으면 불이 올라오며, 하늘의 UFO 가 별을 네 발씩 쏩니다. 하트는 셋이고 맞으면 걸음이 느려집니다. 제한 시간은 95초, 중간에 하트 회복 두 개가 떨어져 있습니다.

조작은 방향키로 이동, Space 로 받기·전하기, Esc 로 잠깐 멈춤입니다.

만드는 방식에 규칙을 걸어 두었습니다. 요청마다 같은 여섯 줄을 붙였고, 그중 둘이 특히 일을 했습니다. '요청하지 않은 것은 바꾸지 않는다' 는 디자인을 고쳐 달라고 했을 때 게임 수치가 함께 흔들리는 일을 막았고, '숫자는 이름 붙인 상수로 만든다' 는 제한 시간이나 하트 개수가 코드 여기저기 흩어지는 것을 막았습니다. 고칠 때마다 테스트를 돌렸고, 지금 35개가 모두 통과합니다.$note$,

  'https://coffee-delivery-game-week3-jh-f22e.vercel.app/',
  '/images/coffee-game-play.png',

  '[
    {"name": "게임 화면 — 작은 행성과 달동네 커피", "url": "/images/coffee-game-play.png",  "type": "image"},
    {"name": "게임 방법",                            "url": "/images/coffee-game-howto.png", "type": "image"},
    {"name": "게임 열기 (after)",  "url": "https://coffee-delivery-game-week3-jh-f22e.vercel.app/after/index.html", "type": "link"},
    {"name": "깃헙 저장소",        "url": "https://github.com/happytuco-arch/coffee-delivery-game-week3",           "type": "link"}
  ]'::jsonb,

  -- 10/1 글과 10/8 글 사이
  '2026-10-05 12:00:00+09'
);


-- 차례가 맞는지 확인 (가운데에 '커피 배달 게임'이 보이면 됩니다)
select week, title, created_at::date as 날짜
from public.assignments
order by created_at desc;
