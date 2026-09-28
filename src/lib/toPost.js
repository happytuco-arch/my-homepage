// ─────────────────────────────────────────────────────────────
//  작품 · 논문 · 과제를 '게시물' 한 모양으로 옮겨 담습니다.
//
//  세 자료는 칸 이름도 내용도 다르지만, 읽는 화면(Article)은 하나만
//  두는 편이 낫습니다. 읽는 사람 입장에서는 전부 '글'이기 때문입니다.
// ─────────────────────────────────────────────────────────────

const EMPTY = {
  chips: [],
  body: [],
  bullets: [],
  bulletsLabel: '',
  images: [],
  files: [],
  links: [],
  facts: [],
  cover: '',
  video: '',
  prompt: '',
  lead: '',
}

/** 작품 (projects) */
export function projectToPost(item) {
  return {
    ...EMPTY,
    id: item.id,
    backLabel: 'All works',
    title: item.title,
    metas: [item.index, item.dateLabel, item.video ? 'Video' : ''],
    lead: item.description,
    cover: item.image,
    video: item.video,
    facts: [
      { label: 'Registered', value: item.dateLabel || '—' },
      { label: 'Source', value: 'Supabase · projects' },
    ],
  }
}

/** 논문 (papers 표 + 코드에 적어 둔 선행연구) */
export function paperToPost(item) {
  const links = []
  if (item.link) links.push({ label: '원문 보기', href: item.link })
  if (item.pdf && item.pdf !== item.link) links.push({ label: 'PDF', href: item.pdf })

  return {
    ...EMPTY,
    id: item.id,
    backLabel: 'All papers',
    title: item.title,
    metas: [item.index, item.venue, item.year].filter(Boolean),
    lead: item.summary,
    chips: item.keywords.map((k) => `#${k}`),
    body: [item.titleKo, item.abstract].filter(Boolean),
    bullets: item.takeaways,
    bulletsLabel: item.takeaways.length
      ? '이 프로젝트와의 연결 — 논문의 주장이 아니라 제가 받아들인 관점입니다'
      : '',
    links,
    facts: [
      { label: 'Authors', value: item.authors || '—' },
      { label: 'Venue', value: item.venue || '—' },
      { label: 'Year', value: item.year || '—' },
      item.citations != null
        ? { label: 'Cited by', value: `${item.citations} (${item.citationSource})` }
        : null,
      item.doi ? { label: 'DOI', value: item.doi } : null,
    ].filter(Boolean),
  }
}

/** 과제 (assignments) */
export function assignmentToPost(item) {
  return {
    ...EMPTY,
    id: item.id,
    backLabel: 'All assignments',
    title: item.title,
    metas: [item.week, item.course, item.dateLabel].filter(Boolean),
    lead: item.note,
    cover: item.image,
    prompt: item.prompt,
    images: item.attachments.filter((a) => a.isImage),
    files: item.attachments.filter((a) => !a.isImage),
    links: item.resultUrl ? [{ label: '결과물 보기', href: item.resultUrl }] : [],
  }
}
