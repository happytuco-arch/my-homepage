import { useCallback, useEffect, useState } from 'react'
import { configMessage, isSupabaseReady, mediaUrl, supabase } from './supabase'

/** 표에서 읽어 오는 칸 */
const COLUMNS = 'id, title, description, image_url, video_url, link_url, pinned, created_at'

/**
 * 관리자 화면에서 작품을 고치면 방문자용 목록도 같이 새로 고쳐야 합니다.
 * 화면마다 따로 불러오고 있으므로, 여기에 모아 두고 한꺼번에 알려 줍니다.
 */
const listeners = new Set()

/**
 * projects 표를 올린 순서대로(먼저 올린 것이 앞) 읽어 옵니다.
 *
 * 돌려주는 status —
 *   'loading'  불러오는 중
 *   'ready'    다 불러옴 (items 가 비어 있으면 '등록된 작품 없음')
 *   'error'    연결 · 조회 실패  → 예시 데이터로 대신 채우지 않습니다
 */
export function useProjects() {
  const [status, setStatus] = useState('loading')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setStatus('loading')
    setError('')

    // .env.local 이 아직 비어 있거나 비밀 열쇠가 들어간 경우
    if (!isSupabaseReady) {
      setError(configMessage)
      setStatus('error')
      return
    }

    const { data, error: dbError } = await supabase
      .from('projects')
      .select(COLUMNS)
      .order('created_at', { ascending: true })

    if (dbError) {
      console.error('[supabase] projects 조회 실패:', dbError)
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

  // 다른 화면에서 작품이 바뀌면 여기도 따라서 새로 불러옵니다
  useEffect(() => {
    listeners.add(load)
    return () => listeners.delete(load)
  }, [load])

  // 관리자 화면이 부르는 reload — 모든 화면을 함께 갱신합니다
  const reloadAll = useCallback(async () => {
    await Promise.all([...listeners].map((fn) => fn()))
  }, [])

  return { status, items, error, reload: reloadAll }
}

/** 화면에서 쓰기 좋은 모양으로 다듬습니다 */
function normalize(row, i) {
  const at = row.created_at ? new Date(row.created_at) : null

  return {
    // 상세 보기를 고를 때 씁니다 (예시 데이터와 구분)
    source: 'project',
    id: row.id,
    index: String(i + 1).padStart(2, '0'),
    title: row.title?.trim() || '제목 없음',
    description: row.description?.trim() || '',
    image: mediaUrl(row.image_url),
    video: mediaUrl(row.video_url),
    // 항상 첫 번째로 걸어 둘 작품인지 (관리자 화면에서 체크합니다)
    pinned: Boolean(row.pinned),
    // 관리자 화면에서 고칠 때는 표에 들어 있는 원래 값이 필요합니다
    // 결과물·원문으로 이어지는 주소 (포스터 PDF, 배포 링크 등)
    linkUrl: row.link_url?.trim() || '',
    imageRaw: row.image_url || '',
    videoRaw: row.video_url || '',
    createdAt: at,
    year: at ? String(at.getFullYear()) : '',
    // 2026. 3. 5. 처럼 보여 줍니다
    dateLabel: at ? at.toLocaleDateString('ko-KR') : '',
  }
}

/**
 * Supabase 가 준 오류를 사람이 읽을 수 있는 한국어로 바꿉니다.
 * 무엇을 고쳐야 하는지까지 알려 주는 것이 목적입니다.
 */
function describe(dbError) {
  const code = dbError.code || ''
  const raw = dbError.message || ''

  // 칸 이름이 다를 때 — '표가 없다'보다 먼저 봅니다.
  // (두 오류 모두 'does not exist' 라고 말하므로 순서가 중요합니다)
  if (code === '42703' || /column .* does not exist/i.test(raw)) {
    return `A column is missing from the projects table. Run the pinned-column SQL in Supabase. (${raw})`
  }
  // 표가 없을 때
  if (code === '42P01' || code === 'PGRST205' || /relation .* does not exist|could not find the table/i.test(raw)) {
    return 'The projects table does not exist. Create it in the Supabase table editor.'
  }
  // 읽기 권한이 막혀 있을 때
  if (code === '42501' || /permission denied|row-level security/i.test(raw)) {
    return 'No permission to read the projects table. Open a public select policy in Supabase.'
  }
  // 열쇠가 틀렸을 때
  if (/JWT|api key|Invalid/i.test(raw)) {
    return 'The key is not valid. Check VITE_SUPABASE_PUBLISHABLE_KEY in .env.local and restart the dev server.'
  }
  // 주소가 틀렸거나 인터넷이 끊겼을 때
  if (/fetch|network|Failed to fetch/i.test(raw)) {
    return 'Could not reach the server. Check your connection and VITE_SUPABASE_URL in .env.local.'
  }

  return `Could not load the data. (${raw || 'unknown error'})`
}
