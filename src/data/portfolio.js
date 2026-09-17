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
  // 첫 화면의 'Based in' 에 표시됩니다
  based: 'SKKU Game Design',
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
  // About 화면 아래쪽의 링크 아이콘
  social: [
    {
      id: 'linkedin',
      label: 'LinkedIn',
      note: '조준혁 · 게임디자인학과',
      href: 'https://www.linkedin.com/in/%EC%A1%B0%EC%A4%80%ED%98%81-%EA%B2%8C%EC%9E%84%EB%94%94%EC%9E%90%EC%9D%B8%ED%95%99%EA%B3%BC-a4b757435/',
    },
    {
      id: 'skku-game',
      label: 'SKKU Game Design',
      note: '성균관대학교 게임디자인학과',
      href: 'https://game.skku.edu/game/index.do',
    },
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

// ─────────────────────────────────────────────────────────────
//  선행연구 (Prior Work)
//
//  이 프로젝트가 어떤 연구 흐름 위에 서 있는지 보여 주는 실제 논문들입니다.
//  서지 정보(저자·학회지·연도·DOI)는 원문에서 확인한 값입니다.
//  citations 는 OpenAlex 기준이며, checkedOn 날짜 시점의 값입니다.
//  (데이터베이스마다 수치가 다릅니다 — Semantic Scholar는 더 높게 나옵니다)
//
//  takeaways 는 논문의 주장이 아니라, 이 프로젝트가 받아들인 관점입니다.
// ─────────────────────────────────────────────────────────────

export const papers = [
  {
    id: 'p1',
    index: '01',
    field: 'Survey',
    title: 'Large Language Models and Games: A Survey and Roadmap',
    titleKo: '거대 언어 모델과 게임: 서베이와 로드맵',
    authors: 'R. Gallotta, G. Todd, M. Zammit, S. Earle, A. Liapis, J. Togelius, G. N. Yannakakis',
    venue: 'IEEE Transactions on Games',
    venueNote: 'SCIE 등재 학술지',
    year: '2024',
    citations: 118,
    citationSource: 'OpenAlex',
    checkedOn: '2026-09-10',
    doi: '10.1109/TG.2024.3461510',
    link: 'https://doi.org/10.1109/TG.2024.3461510',
    summary:
      '거대 언어 모델이 게임 안에서 맡을 수 있는 역할을 유형으로 정리하고, 아직 시도되지 않은 영역과 한계를 함께 짚은 이 분야의 대표 서베이입니다.',
    abstract:
      '이 논문은 게임 분야에서 거대 언어 모델(LLM)이 어떻게 활용되고 있는지 전반을 조사합니다. 게임 안에서 또 게임을 위해 LLM이 쓰이는 다양한 응용을 정리하고, LLM이 맡을 수 있는 서로 다른 역할들을 구분합니다. 아직 충분히 탐색되지 않은 영역과 앞으로 유망한 방향을 제시하며, 게임 영역에서 LLM이 가진 가능성과 한계를 함께 정리합니다.',
    takeaways: [
      '"LLM으로 무엇을 만들까"보다 "LLM에게 어떤 역할을 맡길까"를 먼저 정한다',
      '가능성만이 아니라 한계도 같이 기록해야 설계 판단의 근거가 남는다',
      '개별 기법이 아니라 연구 지형 전체를 먼저 보고 내 작업의 자리를 잡는다',
    ],
    keywords: ['거대 언어 모델', '게임 연구 지형', '역할 유형화'],
  },
  {
    id: 'p2',
    index: '02',
    field: 'Level Generation',
    title: 'Level Generation Through Large Language Models',
    titleKo: '거대 언어 모델을 이용한 게임 레벨 생성',
    authors: 'G. Todd, S. Earle, M. U. Nasir, M. C. Green, J. Togelius',
    venue: 'Foundations of Digital Games (FDG)',
    venueNote: '게임 연구 대표 학회',
    year: '2023',
    citations: 83,
    citationSource: 'OpenAlex',
    checkedOn: '2026-09-10',
    doi: '10.1145/3582437.3587211',
    link: 'https://doi.org/10.1145/3582437.3587211',
    summary:
      '퍼즐 게임 소코반의 레벨을 언어 모델로 생성해 보고, 학습 데이터의 양이 늘어날수록 결과가 급격히 좋아진다는 것을 보였습니다.',
    abstract:
      '이 논문은 거대 언어 모델로 퍼즐 게임 소코반의 레벨을 생성할 수 있는지 검증합니다. 게임 레벨은 복잡한 기능적 제약과 2차원 이상의 공간 관계를 가지고 있어, 언어 모델이 학습 과정에서 흔히 접하는 데이터와는 성격이 크게 다릅니다. 실험 결과 언어 모델은 실제로 플레이 가능한 레벨을 만들어 냈으며, 그 성능은 학습 데이터셋의 크기에 따라 극적으로 향상되었습니다.',
    takeaways: [
      '레벨은 글이 아니라 규칙이다 — 생성 결과는 반드시 플레이 가능성으로 검증한다',
      '모델을 바꾸기 전에 데이터를 먼저 늘리는 쪽이 효과가 크다',
      '제작 과정에서 만든 레벨 기록 자체가 다음 생성의 재료가 된다',
    ],
    keywords: ['절차적 생성', '소코반', '데이터셋 규모'],
  },
]
