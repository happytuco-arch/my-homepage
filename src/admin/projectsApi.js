// ─────────────────────────────────────────────────────────────
//  작품 등록 · 수정 · 삭제, 그리고 파일 올리기
//
//  전부 공개용 열쇠 하나로만 움직입니다. 비밀 열쇠는 쓰지 않습니다.
//  "누가 해도 되는가"는 이 파일이 아니라 Supabase 쪽 RLS 규칙이 정합니다.
//  그래서 이 코드를 고쳐도 관리자가 아니면 서버가 거절합니다.
// ─────────────────────────────────────────────────────────────

import { STORAGE_BUCKET, supabase } from '../lib/supabase'
import { MEDIA } from './config'

/** 파일 이름에서 한글·빈칸·특수문자를 걷어냅니다 (주소에 들어가야 하므로) */
function safeName(name) {
  const dot = name.lastIndexOf('.')
  const base = dot > 0 ? name.slice(0, dot) : name
  const ext = dot > 0 ? name.slice(dot).toLowerCase() : ''

  const cleaned = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)

  return `${cleaned || 'file'}${ext}`
}

/**
 * 파일 하나를 Storage 에 올리고, 화면에서 쓸 주소를 돌려줍니다.
 *
 * @param {'image'|'video'} kind
 * @param {File} file
 * @returns {Promise<{path: string, url: string}>}
 */
export async function uploadMedia(kind, file) {
  if (!supabase) throw new Error('Supabase 에 연결되어 있지 않습니다.')
  if (!STORAGE_BUCKET) {
    throw new Error('.env.local 에 VITE_SUPABASE_STORAGE_BUCKET 이 비어 있습니다.')
  }

  // 규칙이 허용하는 칸은 images/ 와 videos/ 두 개뿐입니다
  const folder = MEDIA[kind].folder
  const path = `${folder}/${Date.now()}-${safeName(file.name)}`

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  })

  if (error) throw new Error(describeStorage(error))

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return { path, url: data.publicUrl }
}

/** 작품 한 줄을 새로 넣습니다 */
export async function createProject(fields) {
  const { data, error } = await supabase.from('projects').insert(toRow(fields)).select().single()
  if (error) throw new Error(describeTable(error, '등록'))
  return data
}

/** 작품 한 줄을 고칩니다 */
export async function updateProject(id, fields) {
  const { data, error } = await supabase
    .from('projects')
    .update(toRow(fields))
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(describeTable(error, '수정'))
  // 규칙에 막히면 오류 대신 '고친 줄 0개'로 돌아오기도 합니다
  if (!data) throw new Error('수정 권한이 없거나 해당 작품을 찾지 못했습니다.')
  return data
}

/** 작품 한 줄을 지웁니다 (파일은 Storage 에 그대로 남습니다) */
export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw new Error(describeTable(error, '삭제'))
}

/** 화면의 입력값을 표의 칸 이름으로 옮깁니다 */
function toRow({ title, description, imageUrl, videoUrl, linkUrl, pinned }) {
  return {
    title: title.trim(),
    description: description.trim() || null,
    image_url: imageUrl?.trim() || null,
    video_url: videoUrl?.trim() || null,
    link_url: linkUrl?.trim() || null,
    pinned: Boolean(pinned),
  }
}

/**
 * '항상 첫 번째' 는 한 작품만 가질 수 있습니다.
 * 새로 지정하면 나머지의 표시를 내립니다.
 */
export async function clearOtherPins(keepId) {
  const { error } = await supabase
    .from('projects')
    .update({ pinned: false })
    .eq('pinned', true)
    .neq('id', keepId)

  if (error) throw new Error(describeTable(error, '대표 작품 지정'))
}

/** 표 작업 오류를 한국어로 */
function describeTable(error, what) {
  const code = error.code || ''
  const raw = error.message || ''

  if (code === '42501' || /row-level security|permission denied/i.test(raw)) {
    return `${what} 권한이 없습니다. 관리자 계정으로 로그인했는지, supabase/admin-policies.sql 을 실행했는지 확인해 주세요.`
  }
  if (code === '23502') {
    return '제목처럼 반드시 있어야 하는 값이 비어 있습니다.'
  }
  if (code === '42P01') {
    return 'projects 표를 찾지 못했습니다.'
  }
  if (/JWT|expired/i.test(raw)) {
    return '로그인이 만료되었습니다. 다시 로그인해 주세요.'
  }
  return `${what}하지 못했습니다. (${raw || '알 수 없는 오류'})`
}

/** 파일 올리기 오류를 한국어로 */
function describeStorage(error) {
  const raw = error.message || ''
  const status = error.statusCode || error.status || ''

  if (/Bucket not found/i.test(raw)) {
    return `Storage 에 '${STORAGE_BUCKET}' 통이 없습니다. Supabase → Storage 에서 만들어 주세요.`
  }
  if (String(status) === '403' || /policy|Unauthorized|violates/i.test(raw)) {
    return '파일을 올릴 권한이 없습니다. 관리자로 로그인했는지, supabase/admin-policies.sql 의 2부(Storage)를 실행했는지 확인해 주세요.'
  }
  if (/exceeded the maximum allowed size|Payload too large/i.test(raw) || String(status) === '413') {
    return '파일이 너무 큽니다. Supabase 가 받을 수 있는 크기를 넘었습니다.'
  }
  if (/already exists/i.test(raw)) {
    return '같은 이름의 파일이 이미 있습니다. 잠시 뒤 다시 시도해 주세요.'
  }
  return `파일을 올리지 못했습니다. (${raw || '알 수 없는 오류'})`
}
