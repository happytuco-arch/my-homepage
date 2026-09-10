// ─────────────────────────────────────────────────────────────
//  포트폴리오 예시 데이터
//  이미지는 public/images/ 안의 파일을 가리킵니다.
//  파일이 없으면 화면에 "이미지 자리" 표시가 대신 나타납니다.
// ─────────────────────────────────────────────────────────────

export const profile = {
  nameKo: 'JH Project',
  nameEn: 'JuneHyuk Cho',
  role: 'Game Design · Research',
  intro: '게임제작과정 및 논문 투고과정을 프로젝트로서 기록합니다.',
  email: 'happytuco@g.skku.edu',
  location: 'Seoul, Republic of Korea',
  affiliation: '성균관대학교 · AI기반 콘텐츠 창업 워크숍',
  year: '2026',
  statement: [
    '만들어진 결과물보다, 만들어지는 동안의 판단을 남기는 일에 관심이 있습니다.',
    '게임을 만들 때는 규칙이 플레이어의 몸에 익는 순간을, 논문을 쓸 때는 직관이 문장으로 굳는 순간을 기록합니다. 두 작업은 서로 다른 언어를 쓰지만 같은 질문을 공유합니다 — 사람은 무엇을 배울 때 즐거워하는가.',
    '이 사이트는 그 과정의 아카이브입니다. 완성된 장면과 아직 정리되지 않은 초안을 함께 올려 둡니다.',
  ],
  facts: [
    { label: 'Focus', value: '게임 시스템 디자인 / 학습 경험 연구' },
    { label: 'Tools', value: 'Unity · Aseprite · Python · React' },
    { label: 'Writing', value: 'HCI · Game Studies · Education' },
    { label: 'Status', value: '협업 및 투고 문의 환영' },
  ],
  links: [
    { label: 'Email', value: 'happytuco@g.skku.edu', href: 'mailto:happytuco@g.skku.edu' },
    { label: 'GitHub', value: 'github.com/junehyuk', href: '#' },
    { label: 'Notion', value: 'Devlog Archive', href: '#' },
  ],
}

export const games = [
  {
    id: 'g1',
    index: '01',
    title: 'PIXEL DRIFT',
    subtitle: '도트로 그린 사이드스크롤 액션',
    year: '2026',
    role: 'Design · Programming',
    stack: 'Unity · C# · Aseprite',
    status: 'In Development',
    image: '/images/dot-world.svg',
    tagline: '한 화면 안에서 끝나는 짧은 모험. 죽어도 3초 뒤에 다시 시작한다.',
    description:
      '점프 한 번의 무게를 정하는 데 4주가 걸렸습니다. 중력, 체공 시간, 착지 후 경직을 각각 따로 조절할 수 있게 만들고 20명에게 플레이 테스트를 돌린 뒤 지금의 값으로 굳혔습니다. 스테이지는 손으로 배치하되, 적의 등장 패턴만 규칙으로 생성해 매번 조금씩 다른 리듬이 나오도록 했습니다.',
    highlights: [
      '점프·낙하 곡선을 분리한 커스텀 물리 컨트롤러',
      '사망 후 3초 내 재시작을 보장하는 체크포인트 설계',
      '적 배치 규칙 기반 준절차적(semi-procedural) 스테이지',
    ],
  },
  {
    id: 'g2',
    index: '02',
    title: 'BLOCK CHOIR',
    subtitle: '블럭을 쌓아 화음을 만드는 퍼즐',
    year: '2025',
    role: 'Design · Sound',
    stack: 'Unity · FMOD',
    status: 'Prototype',
    image: '/images/dot-blocks.svg',
    tagline: '블럭이 맞물릴 때마다 화음이 하나씩 쌓인다.',
    description:
      '퍼즐을 푸는 행위 자체가 연주가 되도록 설계한 프로토타입입니다. 같은 색 블럭이 인접하면 코드 톤이 더해지고, 오답 배치는 불협화음으로 즉시 되돌아옵니다. 정답을 글자로 알려 주지 않아도 플레이어가 귀로 먼저 알아채는지 확인하는 것이 실험의 목표였습니다.',
    highlights: [
      '텍스트 없는 피드백 — 정답/오답을 소리로만 전달',
      '12인 사용자 테스트에서 평균 학습 시간 1분 40초',
      '색각 이상 대응을 위한 패턴 병기 모드',
    ],
  },
  {
    id: 'g3',
    index: '03',
    title: 'LITTLE KEEPER',
    subtitle: '작은 캐릭터를 돌보는 루틴 게임',
    year: '2025',
    role: 'Design · Pixel Art',
    stack: 'Godot · Aseprite',
    status: 'Released',
    image: '/images/dot-hero.svg',
    tagline: '하루에 3분, 아주 느리게 자라는 친구.',
    description:
      '매일 짧게 접속하는 습관형 게임입니다. 성장 속도를 일부러 느리게 잡고, 접속하지 않은 날에도 캐릭터가 벌을 받지 않도록 했습니다. 죄책감을 동력으로 쓰지 않는 돌봄 게임이 가능한지 확인하려는 시도였습니다.',
    highlights: [
      '결석 페널티가 없는 성장 곡선',
      '32×32 도트 스프라이트 140여 장 직접 제작',
      '출시 후 4주 기준 잔존율 38%',
    ],
  },
]

// Games 탭 하단 — 제작 과정 기록 갤러리 (Masonry)
export const gallery = [
  {
    id: 'a1',
    index: '01',
    title: 'World Tileset — v3',
    caption: '배경 타일 팔레트를 8색으로 줄이던 날',
    image: '/images/dot-world.svg',
    ratio: 'wide',
  },
  {
    id: 'a2',
    index: '02',
    title: 'Keeper Sprite Sheet',
    caption: '대기 모션 6프레임, 눈 깜빡임 타이밍 실험',
    image: '/images/dot-hero.svg',
    ratio: 'tall',
  },
  {
    id: 'a3',
    index: '03',
    title: 'Chord Blocks',
    caption: '블럭 색과 코드 톤을 매칭한 초기 스케치',
    image: '/images/dot-blocks.svg',
    ratio: 'square',
  },
  {
    id: 'a4',
    index: '04',
    title: 'Dungeon Pass — 미배치',
    caption: '아직 이미지 파일을 올리지 않은 자리입니다',
    image: '/images/dot-dungeon.png',
    ratio: 'tall',
  },
  {
    id: 'a5',
    index: '05',
    title: 'UI Frame Study',
    caption: '체력 게이지 프레임 두께 비교',
    image: '/images/dot-blocks.svg',
    ratio: 'square',
  },
  {
    id: 'a6',
    index: '06',
    title: 'Sky Gradient Test',
    caption: '디더링 없이 하늘 그라데이션 만들기',
    image: '/images/dot-world.svg',
    ratio: 'wide',
  },
]

export const papers = [
  {
    id: 'p1',
    index: '01',
    field: 'Game Studies',
    title: '실패의 리듬: 짧은 재시도 주기가 플레이어 지속성에 미치는 영향',
    titleEn: 'The Rhythm of Failure: Short Retry Cycles and Player Persistence',
    venue: '한국게임학회 논문지',
    year: '2026',
    status: '투고 준비',
    summary:
      '죽은 뒤 다시 시작하기까지의 시간이 3초를 넘어가면 이탈률이 급격히 오른다는 가설을 실측했습니다.',
    keywords: ['난이도 설계', '재시도 주기', '플레이어 이탈'],
    image: '/images/dot-world.svg',
    abstract:
      '액션 게임에서 사망은 처벌이 아니라 학습의 단위입니다. 본 연구는 재시도까지의 대기 시간을 1초부터 8초까지 조작한 네 가지 빌드를 제작하고, 참가자 62명의 플레이 로그를 분석했습니다. 대기 시간이 3초를 넘는 조건에서 세션 이탈률이 유의하게 증가했으며(p < .01), 주관적 난이도 평가는 조건 간 차이가 없었습니다. 이는 플레이어가 어려움 자체보다 흐름의 끊김에 반응한다는 점을 시사합니다.',
    contributions: [
      '재시도 대기 시간을 독립 변인으로 분리한 실험 빌드 4종 제작',
      '62명 플레이 로그 기반 이탈 지점 정량 분석',
      '난이도 지각과 이탈 행동의 불일치 확인',
    ],
  },
  {
    id: 'p2',
    index: '02',
    field: 'HCI',
    title: '소리로만 주는 피드백: 텍스트 없는 퍼즐 게임의 학습 곡선',
    titleEn: 'Feedback Without Words: Learning Curves in Audio-Only Puzzle Games',
    venue: 'HCI Korea',
    year: '2025',
    status: '게재',
    summary:
      '정답 여부를 글자 대신 화음으로만 알려 줄 때, 플레이어는 평균 1분 40초 만에 규칙을 스스로 찾아냅니다.',
    keywords: ['청각 피드백', '튜토리얼 없는 학습', '접근성'],
    image: '/images/dot-blocks.svg',
    abstract:
      'BLOCK CHOIR 프로토타입을 도구로 삼아, 시각·텍스트 안내를 모두 제거하고 청각 피드백만 남긴 조건에서의 규칙 습득 과정을 관찰했습니다. 참가자 12명 중 11명이 외부 도움 없이 핵심 규칙에 도달했고, 평균 소요 시간은 100초였습니다. 사후 인터뷰에서 참가자들은 "틀렸다"는 감각을 불협화음으로 먼저 인지했다고 보고했습니다.',
    contributions: [
      '청각 단독 피드백 조건의 규칙 습득 시간 측정',
      '색각 이상 사용자를 포함한 접근성 대안 제시',
      '무텍스트 튜토리얼 설계 가이드라인 3항 도출',
    ],
  },
  {
    id: 'p3',
    index: '03',
    field: 'Education',
    title: '죄책감 없는 습관 설계: 결석 페널티를 제거한 돌봄 게임의 잔존율',
    titleEn: 'Habit Without Guilt: Retention in Care Games Without Absence Penalties',
    venue: '한국콘텐츠학회 (심사 중)',
    year: '2025',
    status: '심사 중',
    summary:
      '접속하지 않은 날을 벌하지 않아도 4주 잔존율 38%를 유지할 수 있는지 실제 출시 데이터로 검증했습니다.',
    keywords: ['습관 형성', '돌봄 게임', '잔존율'],
    image: '/images/dot-hero.svg',
    abstract:
      '다수의 돌봄형 게임은 접속하지 않은 사용자에게 캐릭터의 상태 악화라는 형태로 페널티를 부과합니다. 본 연구는 이러한 장치를 완전히 제거한 LITTLE KEEPER의 출시 후 4주 로그(N = 1,204)를 분석하여, 페널티 없이도 비교 가능한 수준의 잔존율이 달성됨을 보였습니다. 재접속 동기는 성장 확인보다 스프라이트 변화에 대한 호기심에서 더 강하게 나타났습니다.',
    contributions: [
      '결석 페널티 제거 조건의 실서비스 잔존 데이터 확보',
      '재접속 동기 요인의 인터뷰 기반 유형화',
      '비강압적 습관 설계 패턴 제안',
    ],
  },
  {
    id: 'p4',
    index: '04',
    field: 'Method',
    title: '제작 기록을 데이터로: 개발 로그의 구조화와 회고 분석',
    titleEn: 'Devlogs as Data: Structuring Production Records for Retrospective Analysis',
    venue: '워크숍 발표 예정',
    year: '2026',
    status: '초고',
    summary:
      '흩어진 개발 일지를 의사결정 단위로 쪼개면, 프로젝트가 어디서 방향을 틀었는지 되짚을 수 있습니다.',
    keywords: ['개발 로그', '회고', '연구 방법론'],
    image: '/images/dot-dungeon.png',
    abstract:
      '개인 개발자의 일지는 대개 서술형으로 축적되어 분석에 쓰이지 못한 채 남습니다. 본 초고는 로그를 "결정–근거–결과" 삼항으로 구조화하는 간단한 기록 양식을 제안하고, 저자 본인의 2년치 로그 480건에 적용한 사례를 보고합니다.',
    contributions: [
      '결정–근거–결과 삼항 기록 양식 제안',
      '480건의 개인 로그 재구조화 사례',
      '회고 시점의 편향을 줄이는 기록 시점 규칙',
    ],
  },
]
