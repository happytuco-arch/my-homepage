import { useCallback, useEffect, useState } from 'react'
import { configMessage, isSupabaseReady, mediaUrl, supabase } from './supabase'

const COLUMNS =
  'id, title, authors, venue, year, doi, link, pdf_url, abstract, summary, takeaways, keywords, citations, created_at'

/** 여러 화면이 같이 새로 고쳐지도록 모아 둡니다 */
const listeners = new Set()

/**
 * papers 표를 최신순으로 읽어 옵니다.
 * status — 'loading' | 'ready' | 'error'
 */
export function usePapers() {
  const [status, setStatus] = useState('loading')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setStatus('loading')
    setError('')

    if (!isSupabaseReady) {
      setError(configMessage)
      setStatus('error')
      return
    }

    const { data, error: dbError } = await supabase
      .from('papers')
      .select(COLUMNS)
      .order('created_at', { ascending: false })

    if (dbError) {
      console.error('[supabase] papers 조회 실패:', dbError)
      setError(describe(dbError))
      setStatus('error')
      return
    }

    setItems((data ?? []).map(normalize))
    setStatus('ready')
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    listeners.add(load)
    return () => listeners.delete(load)
  }, [load])

  const reloadAll = useCallback(async () => {
    await Promise.all([...listeners].map((fn) => fn()))
  }, [])

  return { status, items, error, reload: reloadAll }
}

/** 쉼표나 줄바꿈으로 적은 것을 목록으로 */
function toList(text, byLine = false) {
  if (!text) return []
  return text
    .split(byLine ? /\r?\n/ : ',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * 화면에서 쓰기 좋은 모양으로 다듬습니다.
 * 기존 상세 보기(DetailView)가 알아보는 칸 이름에 맞춥니다.
 */
function normalize(row, i) {
  const at = row.created_at ? new Date(row.created_at) : null
  const pdf = mediaUrl(row.pdf_url)

  // 원문 주소가 없으면 DOI, 그것도 없으면 올려 둔 PDF 로 이어 줍니다
  const link = row.link?.trim() || (row.doi ? `https://doi.org/${row.doi.trim()}` : pdf)

  return {
    source: 'paperRow',
    id: row.id,
    index: String(i + 1).padStart(2, '0'),

    title: row.title?.trim() || '제목 없음',
    titleKo: '',
    authors: row.authors?.trim() || '',
    venue: row.venue?.trim() || '—',
    venueNote: row.doi ? `DOI ${row.doi}` : '등록한 논문',
    year: row.year?.trim() || '',
    field: row.keywords ? toList(row.keywords)[0] : 'Paper',

    doi: row.doi?.trim() || '',
    link,
    pdf,

    summary: row.summary?.trim() || '',
    abstract: row.abstract?.trim() || '',
    takeaways: toList(row.takeaways, true),
    keywords: toList(row.keywords),

    citations: typeof row.citations === 'number' ? row.citations : null,
    citationSource: 'OpenAlex',
    checkedOn: at ? at.toISOString().slice(0, 10) : '',

    // 관리자 화면에서 고칠 때 쓰는 원래 값
    raw: row,
  }
}

function describe(dbError) {
  const code = dbError.code || ''
  const raw = dbError.message || ''

  // 표가 아직 없을 때 — PostgREST 는 'schema cache' 라는 말로 알려 줍니다
  if (
    code === '42P01' ||
    code === 'PGRST205' ||
    /relation .* does not exist|could not find the table/i.test(raw)
  ) {
    return 'The papers table does not exist yet. Run supabase/papers-setup.sql in the Supabase SQL editor.'
  }
  if (code === '42501' || /permission denied|row-level security/i.test(raw)) {
    return 'No permission to read the papers table. Run parts 2 and 3 of supabase/papers-setup.sql.'
  }
  if (/fetch|network/i.test(raw)) {
    return 'Could not reach the server. Check your internet connection.'
  }
  return `Could not load the papers. (${raw || 'unknown error'})`
}
