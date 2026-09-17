// ─────────────────────────────────────────────────────────────
//  Supabase 연결
//
//  값은 .env.local 에서 읽어 옵니다. 코드에는 열쇠를 적지 않습니다.
//  (.env.local 은 .gitignore 가 막고 있어 레포지토리에 올라가지 않습니다)
//
//  여기서 쓰는 열쇠는 '공개용(publishable · anon)' 하나뿐입니다.
//  이 사이트는 정적 사이트라 열쇠가 방문자 브라우저까지 그대로 전달됩니다.
//  그래서 —
//    · secret · service_role 열쇠는 절대 쓰지 않습니다 (아래에서 막아 둡니다)
//    · 방문자가 무엇을 할 수 있는지는 Supabase 쪽 RLS 규칙이 정합니다
//      (읽기만 열어 두세요. 아래 주석에 설정 방법을 적어 두었습니다)
// ─────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'

/**
 * 주소를 다듬습니다.
 *
 * Supabase 화면에서 주소를 복사하면 뒤에 /rest/v1 이 붙어 오는 경우가 있는데,
 * 라이브러리가 그 부분을 스스로 붙이기 때문에 그대로 두면 두 번 붙어 조회가 실패합니다.
 * 필요한 것은 https://xxxx.supabase.co 까지입니다.
 */
function cleanUrl(value) {
  return value
    ?.trim()
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/, '')
}

const url = cleanUrl(import.meta.env.VITE_SUPABASE_URL)
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

/** 사진·영상을 담아 둔 저장소 통 이름 */
export const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET?.trim() || ''

/**
 * 넣은 열쇠가 '비밀 열쇠'인지 살핍니다.
 * 비밀 열쇠는 방문자에게 그대로 노출되면 데이터를 마음대로 고칠 수 있게 되므로,
 * 실수로 넣었을 때 연결하지 않고 곧바로 알려 줍니다.
 */
function looksSecret(value) {
  if (!value) return false
  if (value.startsWith('sb_secret_')) return true
  // 예전 형식(JWT)은 가운데 토막에 role 이 들어 있습니다
  const body = value.split('.')[1]
  if (!body) return false
  try {
    const json = atob(body.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json).role === 'service_role'
  } catch {
    return false
  }
}

/**
 * 설정 상태 — 화면에 안내 문구를 고르는 데 씁니다.
 * 'ok' | 'missing'(값이 비어 있음) | 'secret'(비밀 열쇠를 넣음)
 */
export const configState = !url || !key ? 'missing' : looksSecret(key) ? 'secret' : 'ok'

export const isSupabaseReady = configState === 'ok'

/** 연결이 안 될 때 화면에 보여 줄 이유 (사람이 읽는 말) */
export const configMessage = {
  missing:
    '아직 Supabase 연결 정보가 없습니다. my-homepage 폴더의 .env.local 에 주소와 공개용 열쇠를 적고, 개발 서버를 껐다 켜 주세요.',
  secret:
    '비밀 열쇠(secret · service_role)가 들어 있어 연결하지 않았습니다. 정적 사이트에서는 이 열쇠가 방문자에게 그대로 보입니다. .env.local 의 값을 공개용(publishable · anon) 열쇠로 바꿔 주세요.',
  ok: '',
}[configState]

if (configState === 'secret') {
  console.error('[supabase] 공개용이 아닌 비밀 열쇠가 설정되어 연결을 중단했습니다.')
}

/**
 * 연결 객체. 설정이 안 되어 있으면 null 입니다.
 * 쓰는 쪽에서 반드시 isSupabaseReady 를 먼저 확인해 주세요.
 */
export const supabase = isSupabaseReady
  ? createClient(url, key, {
      auth: {
        // 관리자가 새로고침해도 로그인이 풀리지 않게 기억해 둡니다.
        // 방문자는 로그인하지 않으므로 아무것도 저장되지 않습니다.
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

/**
 * 저장해 둔 파일 주소를 화면에서 쓸 수 있는 주소로 바꿉니다.
 *
 *  · http 로 시작하면  → 이미 완전한 주소이므로 그대로 씁니다
 *                        (유튜브 링크, 다른 곳에 올린 파일 등)
 *  · / 로 시작하면     → 이 사이트 안(public 폴더)의 파일로 봅니다
 *                        예) /videos/trailer.mp4  →  public/videos/trailer.mp4
 *  · 그 밖에는         → 저장소 통(bucket) 안의 파일 이름으로 봅니다
 */
export function mediaUrl(pathOrUrl) {
  const value = pathOrUrl?.trim()
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  if (value.startsWith('/')) return value
  if (!supabase || !STORAGE_BUCKET) return ''

  const clean = value.replace(/^\/+/, '')
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(clean).data.publicUrl
}

// ─────────────────────────────────────────────────────────────
//  Supabase 쪽 준비 (사이트 코드가 아니라 Supabase 홈페이지에서 하는 일)
//
//  1) Table Editor 에서 projects 표를 만듭니다
//       id          uuid       기본값 gen_random_uuid()
//       title       text
//       description text
//       image_url   text
//       video_url   text
//       created_at  timestamptz  기본값 now()
//
//  2) 방문자가 '읽기만' 할 수 있게 잠급니다 (SQL Editor 에 붙여넣기)
//
//       alter table projects enable row level security;
//
//       create policy "누구나 조회만"
//         on projects for select
//         to anon
//         using (true);
//
//     쓰기(insert · update · delete) 규칙은 만들지 않습니다.
//     규칙이 없으면 막히므로, 방문자는 글을 넣거나 고칠 수 없습니다.
//
//  3) Storage 에 통을 만들고 Public 으로 두면 사진·영상이 화면에 보입니다.
// ─────────────────────────────────────────────────────────────
