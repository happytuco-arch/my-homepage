-- ═════════════════════════════════════════════════════════════
--  WEEK 8 · 영상 생성 과제 — 새 글 추가
--
--  기존 WEEK 8(Figma) 글은 건드리지 않고 한 건을 새로 넣습니다.
--  붙여넣는 곳 : Supabase → SQL Editor → New query → Run
--  맨 끝 두 구문이 \r 정리와 확인까지 해 줍니다.
-- ═════════════════════════════════════════════════════════════

insert into public.assignments
  (title, course, week, prompt, note, result_url, image_url, attachments, created_at)
values (
  '내가 랜딩페이지를 소개한다 — 5칸 스토리보드로 만든 AI 숏폼',
  'AI기반 콘텐츠 창업 워크숍',
  'WEEK 8',

  $prompt$Gemini 에 준 프롬프트 — 세 단계

[1] 얼굴 사진 한 장 → 5칸 스토리보드 (Gemini 이미지 생성)

Using the attached photo as the ONLY reference for the man's face, create ONE wide storyboard image made of 5 vertical panels placed side by side on a dark gray background, like a production slide. Under each panel write a small white label: "@image1" … "@image5". The same Korean man appears in the panels — keep his face identical to the attached photo in every panel. He wears a dark navy two-button suit, white shirt and slim black tie. Photorealistic, soft studio lighting.

Panel 1: A large monitor in a dark studio showing a minimal portfolio website — black top bar with "JH PROJECT" and "WORKS  PAPERS  ASSIGNMENTS  ABOUT", a huge serif headline "Games & research, as a record." No person.
Panel 2: The same monitor. The man walks into the frame from off-screen on the RIGHT.
Panel 3: The man stands beside the monitor with floating WORKS, PAPERS, ASSIGNMENTS windows, extending his arm toward them.
Panel 4 / 5: Character sheet — the navy suit, and a large close-up of his face.


[2] 칸2 수정 — 걷는 방향만

Edit the attached image. Change ONLY panel 2. Keep panels 1, 3, 4 and 5 and all labels exactly as they are. Keep the same man, position, size and background. Change only his walking direction: he is walking INTO the frame from off-screen on the RIGHT, moving toward the LEFT (toward the monitor). His body and feet point to the left. His head is turned toward the camera with a friendly smile.


[3] 스토리보드 → 영상 (Gemini · Veo)

Create a video without background music, No background music, fixed camera, Use @image5 as a reference for the man's face and @image4 as a reference for his navy suit and overall appearance, use the uploaded images exactly as provided, Make a video with one take camera, vertical 9:16. The attached image is a storyboard used only as reference, do not show the grid, borders, labels or multiple panels, show one single full-screen scene.

0:00 ~ 0:01 The video begins with @image1, a monitor in a dark studio showing the portfolio website "Games & research, as a record." No person is visible.
0:01 ~ 0:03 A man dressed in a navy suit walks into the frame from off-screen on the RIGHT side, moving left toward the monitor at a calm and confident pace, as shown in @image2. No special effects appear. His face matches @image5 exactly.
0:03 ~ 0:06 The man stops beside the monitor and stands as shown in @image3. Floating windows labeled WORKS, PAPERS and ASSIGNMENTS appear beside the monitor. He extends his right arm with an open palm and points to each window in turn, WORKS, then PAPERS, then ASSIGNMENTS, and says "제 작품과 논문, 과제를 소개합니다." in Korean.
0:06 ~ 0:08 He lowers his arm, faces the camera directly, and bows deeply at 90 degrees, holding the bow until the end of the video.$prompt$,

  $note$얼굴 사진 한 장과 실제 사이트 화면에서 출발해, "내가 랜딩페이지를 소개한다"는 10초 세로 숏폼을 만들었습니다. 도구는 Gemini 하나입니다 — 이미지 생성으로 스토리보드를, Veo 로 영상을 만들었습니다.

세미나에서 배운 방식대로 여러 장면을 한 장의 스토리보드로 묶고, 영상 프롬프트에서 시간 구간마다 어느 칸을 따를지 지정했습니다(0:00~0:01 → @image1, 0:01~0:03 → @image2 …). 칸은 키프레임 역할을 하고, 영상은 칸과 칸 사이의 움직임을 채웁니다. 결과는 빈 모니터 → 오른쪽에서 걸어 들어옴 → WORKS·PAPERS·ASSIGNMENTS 설명 → 90도 인사로 이어지는 한 번의 롱테이크입니다.

가장 큰 수정은 컨셉 자체였습니다. 처음에는 "모니터 화면 속에서 걸어 나오는" 장면을 계획했지만, 생성된 이미지에서 사람이 모니터 위에 겹쳐 서거나 손발이 화면과 엉켰습니다. AI 가 가장 어려워하는 동작이라고 판단하고, "화면 오른쪽 밖에서 걸어 들어오는" 장면으로 바꿨습니다. 그다음 칸2만 골라 걷는 방향을 모니터 쪽으로 고쳤습니다. 다시 그리기를 요청하면 배경과 얼굴까지 매번 새로 그려져서, 바꿀 칸과 남길 칸을 프롬프트에 분명히 적는 것이 중요했습니다.

아쉬운 점도 적어 둡니다. 영상 속 얼굴은 같은 사람으로 알아볼 수 있지만 원본보다 조금 둥글고 부드럽습니다. 기준 얼굴(@image5)이 실제 사진이 아니라 이미 Gemini 가 한 번 그린 얼굴이라, 사진 → 그림 → 영상으로 두 번 거치며 조금씩 멀어진 것으로 봅니다. 다음에는 실제 사진을 영상 단계에도 직접 붙이겠습니다. 또 하루 영상 생성 한도와 학교 계정의 도구 제한(Flow 차단) 때문에 다른 도구들도 시도해 봤고, 최종본은 Gemini 로 만들었습니다.$note$,

  null,
  null,

  '[
    {"name": "숏폼 영상 (10초 · 세로)", "url": "/videos/week8-landing-intro.mp4", "type": "video"},
    {"name": "워크플로우 — Reference → Image → Video", "url": "/images/week8-video-workflow.png", "type": "image"},
    {"name": "5칸 스토리보드 (@image1 ~ @image5)", "url": "/images/week8-video-storyboard.png", "type": "image"},
    {"name": "영상 파일 내려받기 (MP4)", "url": "/videos/week8-landing-intro.mp4", "type": "file"}
  ]'::jsonb,

  now()
);

-- 붙여넣기로 섞여 들어간 \r 정리
update public.assignments
set prompt = replace(prompt, chr(13), ''),
    note   = replace(note,   chr(13), '')
where title like '내가 랜딩페이지를 소개한다%';

-- 확인 — 맨 위가 이 글, 첨부 4개
select week, title, jsonb_array_length(attachments) as 첨부, created_at
from public.assignments
order by created_at desc;
