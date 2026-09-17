// ─────────────────────────────────────────────────────────────
//  논문 정보 자동 가져오기
//
//  DOI 하나만 있으면 제목·저자·학술지·연도·인용수·초록을 받아 옵니다.
//  쓰는 곳은 OpenAlex 와 Crossref — 둘 다 공개 학술 데이터베이스이고
//  열쇠가 필요 없으며 브라우저에서 바로 부를 수 있습니다.
//
//  ※ 이것은 'AI 요약'이 아니라 '서지 정보 조회'입니다.
//    초록은 논문 저자가 쓴 원문을 그대로 가져옵니다.
// ─────────────────────────────────────────────────────────────

/** 주소든 글자든 그 안에 섞여 있는 DOI 를 찾아냅니다 */
export function extractDoi(input) {
  if (!input) return ''
  const m = input.match(/10\.\d{4,9}\/[^\s"'<>]+/i)
  return m ? m[0].replace(/[.,;)\]]+$/, '') : ''
}

/**
 * OpenAlex 는 초록을 '낱말 → 위치 목록' 형태로 줍니다.
 * 원래 문장으로 되돌립니다.
 */
function rebuildAbstract(index) {
  if (!index) return ''
  const words = []
  for (const [word, spots] of Object.entries(index)) {
    for (const spot of spots) words[spot] = word
  }
  return words.join(' ').replace(/\s+/g, ' ').trim()
}

/** 저자 목록을 'A. Kim, B. Lee' 모양으로 */
function formatAuthors(authorships = []) {
  return authorships
    .map((a) => a.author?.display_name)
    .filter(Boolean)
    .join(', ')
}

/**
 * DOI 로 논문 정보를 찾습니다.
 * @returns {Promise<object>} 화면 입력칸에 그대로 넣을 수 있는 모양
 */
export async function lookupByDoi(rawInput) {
  const doi = extractDoi(rawInput)
  if (!doi) {
    throw new Error(
      'DOI 를 찾지 못했습니다. 10.xxxx/... 모양의 DOI 나 그것이 포함된 주소를 넣어 주세요.',
    )
  }

  const found = await fromOpenAlex(doi).catch(() => null)
  if (found) return found

  const backup = await fromCrossref(doi).catch(() => null)
  if (backup) return backup

  throw new Error('그 DOI 로 논문을 찾지 못했습니다. 번호를 다시 확인해 주세요.')
}

async function fromOpenAlex(doi) {
  const res = await fetch(`https://api.openalex.org/works/https://doi.org/${doi}`)
  if (!res.ok) throw new Error('openalex')
  const w = await res.json()

  return {
    title: w.display_name || '',
    authors: formatAuthors(w.authorships),
    venue: w.primary_location?.source?.display_name || '',
    year: w.publication_year ? String(w.publication_year) : '',
    citations: typeof w.cited_by_count === 'number' ? w.cited_by_count : null,
    abstract: rebuildAbstract(w.abstract_inverted_index),
    doi,
    link: `https://doi.org/${doi}`,
    source: 'OpenAlex',
  }
}

async function fromCrossref(doi) {
  const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`)
  if (!res.ok) throw new Error('crossref')
  const w = (await res.json()).message

  const authors = (w.author || [])
    .map((a) => [a.given, a.family].filter(Boolean).join(' '))
    .filter(Boolean)
    .join(', ')

  return {
    title: Array.isArray(w.title) ? w.title[0] : w.title || '',
    authors,
    venue: (Array.isArray(w['container-title']) ? w['container-title'][0] : '') || w.publisher || '',
    year: String(w.issued?.['date-parts']?.[0]?.[0] || ''),
    citations: typeof w['is-referenced-by-count'] === 'number' ? w['is-referenced-by-count'] : null,
    // Crossref 초록은 XML 조각으로 오는 경우가 많아 태그를 걷어 냅니다
    abstract: (w.abstract || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    doi,
    link: `https://doi.org/${doi}`,
    source: 'Crossref',
  }
}
