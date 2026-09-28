import { useCallback, useEffect, useState } from 'react'
import { configMessage, isSupabaseReady, mediaUrl, supabase } from './supabase'

const COLUMNS =
  'id, title, course, week, prompt, note, result_url, image_url, attachments, created_at'

/** 여러 화면이 같이 새로 고쳐지도록 모아 둡니다 */
const listeners = new Set()

/**
 * assignments 표를 최신순으로 읽어 옵니다.
 * status — 'loading' | 'ready' | 'error'
 */
export function useAssignments() {
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
      .from('assignments')
      .select(COLUMNS)
      .order('created_at', { ascending: false })

    if (dbError) {
      console.error('[supabase] assignments 조회 실패:', dbError)
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

function normalize(row, i) {
  const at = row.created_at ? new Date(row.created_at) : null

  return {
    source: 'assignment',
    id: row.id,
    index: String(i + 1).padStart(2, '0'),
    title: row.title?.trim() || '제목 없음',
    course: row.course?.trim() || '',
    week: row.week?.trim() || '',
    prompt: row.prompt?.trim() || '',
    note: row.note?.trim() || '',
    resultUrl: row.result_url?.trim() || '',
    image: mediaUrl(row.image_url),
    // 올려 둔 프로젝트물 목록 — 사진과 그 밖의 파일을 나눠 둡니다
    attachments: (Array.isArray(row.attachments) ? row.attachments : []).map((a) => ({
      name: a?.name || '파일',
      url: mediaUrl(a?.url),
      isImage: a?.type === 'image',
    })).filter((a) => a.url),
    dateLabel: at ? at.toLocaleDateString('ko-KR') : '',
    raw: row,
  }
}

function describe(dbError) {
  const code = dbError.code || ''
  const raw = dbError.message || ''

  if (code === '42703' || /column .* does not exist/i.test(raw)) {
    return `A column is missing from the assignments table. (${raw})`
  }
  if (
    code === '42P01' ||
    code === 'PGRST205' ||
    /relation .* does not exist|could not find the table/i.test(raw)
  ) {
    return 'The assignments table does not exist yet. Run supabase/assignments-setup.sql in the Supabase SQL editor.'
  }
  if (code === '42501' || /permission denied|row-level security/i.test(raw)) {
    return 'No permission to read the assignments table. Run parts 2 and 3 of assignments-setup.sql.'
  }
  if (/fetch|network/i.test(raw)) {
    return 'Could not reach the server. Check your internet connection.'
  }
  return `Could not load the assignments. (${raw || 'unknown error'})`
}
