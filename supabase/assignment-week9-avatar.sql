-- ═════════════════════════════════════════════════════════════
--  WEEK 9 · AI 발표 앱 — 내 홈페이지를 소개하는 3D 아바타 — 새 글 추가
--
--  기존 글은 건드리지 않고 한 건을 새로 넣습니다.
--  붙여넣는 곳 : Supabase → SQL Editor → New query → Run
--  맨 끝 두 구문이 \r 정리와 확인까지 해 줍니다.
-- ═════════════════════════════════════════════════════════════

insert into public.assignments
  (title, course, week, prompt, note, result_url, image_url, attachments, created_at)
values (
  'AI 발표 앱 — 내 홈페이지를 걸어 다니며 소개하는 3D 아바타',
  'AI기반 콘텐츠 창업 워크숍',
  'WEEK 9',

  $prompt$Claude Code 에 준 프롬프트 — 기획부터 다듬기까지

[1] 사용 장면 한 장으로 기획 시작 (wayfinder 스킬)

/mattpocock-skills:wayfinder homepage-avatar/docs/00-사용장면.md 를 읽고 이 앱을 같이 기획하자

  00-사용장면.md 의 한 줄 장면:
  방문자(교수님·동료)가 앱을 실행하면, 내 아바타가 내 홈페이지를 직접 넘기며 목소리로 소개하고,
  인터뷰어가 던지는 질문에 스스로 답한 뒤 90도로 인사하고 끝나는 프로그램.

  꼭 지킬 조건:
  - Windows와 Mac 모두에서 동작 (Electron)
  - ElevenLabs 키는 앱 메인 프로세스의 .env 에만. 화면·사이트·깃에 노출 금지
  - 생성한 음성은 파일로 캐시해 같은 대사는 다시 생성하지 않는다(크레딧 절약)
  - 키가 없거나 인터넷이 끊기면 컴퓨터 내장 음성으로 자동 전환해 끝까지 재생
  - 대본의 사실은 실제 사이트 데이터에서만 가져온다. 지어내지 않는다
  - my-homepage 코드는 수정하지 않는다. 앱은 사이트를 바깥에서 조작만 한다


[2] 움직임 추가

아바타의 움직임 추가해줘. 홈페이지 화면 곳곳을 누빈다던지, 게시글 근처로 직접 움직인다던지,
걸어가서 손으로 발표내용 부분을 가리켜 뻗는다던지.
대본내용 텍스트로 전체적으로 보여주면, 고칠 내용 알려줄게. 위트있는 분위기 풀 수 있는 멘트도.


[3] 대본·연출 다듬기 (여러 번 반복)

- 홈페이지 주인 대신 "JH 아바타입니다"로 소개
- 디지털게임 영상은 눌러서 끝까지 틀고 닫기
- 과제 게시글은 각각 클릭해서 스크롤 내리며 내용 보여주기
- papers 도 클릭해서 보여주고, about 페이지를 설명하며 마무리
- 낭독 말고 핵심을 재구성한 대화체로$prompt$,

  $note$내 홈페이지를 3D 아바타가 직접 걸어 다니며 발표하는 데스크톱 앱을 만들었습니다. 앱을 켜면 정장 차림의 "JH 아바타"가 걸어 들어와 인사하고, Works → Papers → Assignments → About 순서로 실제 사이트를 넘기며 인터뷰어와 대화하듯 소개한 뒤 90도로 인사합니다. 발표는 약 8분이고, 보는 사람은 언제든 글자나 말로 질문할 수 있습니다.

■ 기획 — 결정 티켓으로 길 찾기
wayfinder 스킬로 GitHub 이슈에 "지도"를 만들고, 정할 것을 티켓으로 나눠 하나씩 결정했습니다. 조사 티켓 4개(ElevenLabs·Electron 구조·내장 음성·사이트 자료)는 에이전트가 동시에 조사했고, 대화 티켓은 질문에 답하며 정했습니다. 조사에서 계획과 부딪히는 사실이 나왔습니다 — ElevenLabs 기본 목소리는 연말에 만료되고 무료 요금제로는 라이브러리 목소리를 API로 쓸 수 없으며, 설치 파일에 넣은 키는 꺼낼 수 있습니다. 이 사실들이 새 결정 티켓이 되었습니다.

■ 구조
· 창 하나에 세 겹 — 실제 사이트 / 자막·버튼 띠 / 사이트 위를 옮겨 다니는 작은 투명 아바타 층
· 아바타는 three.js 로 코드에서 그린 정장 인물. 걷기·손 흔들기·가리키기·90도 인사를 관절을 돌려 만듭니다
· 사이트 코드는 고치지 않고, 실행 중인 페이지에 손 모양 커서와 주황 강조 테두리를 덧붙여 메뉴를 누르고 글을 엽니다
· 대본의 사실은 Supabase 공개 자료에서만 가져오고, Claude 가 대화체로 각색한 뒤 제가 다듬었습니다
· 직접 질문은 Claude 가 사이트 자료만 근거로 2~3문장으로 답하고, 근거가 없으면 "홈페이지에는 없어요"라고 답합니다
· 키나 인터넷이 없어도 동봉한 각색 대본·질문 목록 40개·내장 음성으로 끝까지 동작합니다

■ 막혔던 곳
· 대본 JSON 이 따옴표 때문에 깨짐 → 도구 입력 형식으로 받아 해결
· 화면이 가려지면 아바타 애니메이션이 멈춤 → 백그라운드 절전(throttling)을 꺼서 해결
· 과제 글을 조금씩 내리면 제자리로 돌아감 → 사이트의 스크롤 스냅 때문. 읽는 동안만 실행 중인 페이지에서 끔
· 빌드한 실행 파일에서만 아바타가 안 보임 → 빌드가 three.js 보조 파일을 빼서, 앱 안에 함께 넣어 해결

■ 배운 점
"사실은 지어내지 않는다"는 조건 하나가 설계 전체를 끌고 갔습니다. 대본·질문 답변·강조할 글 제목까지 모두 사이트 자료에서만 오게 하고, 테스트로 확인합니다. 그리고 AI 가 쓴 대본도 결국 사람이 직접 들어 보고 고쳐야 발표다워졌습니다.$note$,

  'https://github.com/happytuco-arch/homepage-avatar',
  '/images/week9-avatar-point.png',

  '[
    {"name": "시연 영상 (30초)", "url": "/videos/week9-avatar-demo.mp4", "type": "video"},
    {"name": "작품 카드 옆에서 팔을 뻗어 짚는 아바타", "url": "/images/week9-avatar-point.png", "type": "image"},
    {"name": "메뉴 아래로 걸어가 가리키기", "url": "/images/week9-avatar-menu.png", "type": "image"},
    {"name": "About — 명함 QR 짚기", "url": "/images/week9-avatar-about.png", "type": "image"},
    {"name": "GitHub 저장소", "url": "https://github.com/happytuco-arch/homepage-avatar", "type": "link"},
    {"name": "실행 파일 받기 (Windows · Mac)", "url": "https://github.com/happytuco-arch/homepage-avatar/releases", "type": "link"},
    {"name": "기획 지도 (결정 티켓)", "url": "https://github.com/happytuco-arch/homepage-avatar/issues/1", "type": "link"}
  ]'::jsonb,

  now()
);

-- 붙여넣기로 섞여 들어간 \r 정리
update public.assignments
set prompt = replace(prompt, chr(13), ''),
    note   = replace(note,   chr(13), '')
where title like 'AI 발표 앱 — 내 홈페이지를%';

-- 확인 — 맨 위가 이 글, 첨부 7개
select week, title, jsonb_array_length(attachments) as 첨부, created_at
from public.assignments
order by created_at desc;
