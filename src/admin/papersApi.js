// ─────────────────────────────────────────────────────────────
//  논문 등록 · 수정 · 삭제, PDF 올리기
//
//  작품(projects)과 같은 방식입니다. 공개용 열쇠만 쓰고,
//  누가 해도 되는지는 Supabase 쪽 RLS 규칙이 정합니다.
// ─────────────────────────────────────────────────────────────

import { STORAGE_BUCKET, supabase } from '../lib/supabase'

/** PDF 를 papers/ 칸에 올리고 주소를 돌려줍니다 */
export async function uploadPdf(file) {
  if (!supabase) throw new Error('Supabase 에 연결되어 있지 않습니다.')
  if (!STORAGE_BUCKET) throw new Error('.env.local 에 저장소 통 이름이 비어 있습니다.')

  const clean = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)

  const path = `papers/${Date.now()}-${clean || 'paper'}.pdf`

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'application/pdf',
  })

  if (error) {
    const raw = error.message || ''
    if (/policy|Unauthorized|violates/i.test(raw) || String(error.statusCode) === '403') {
      throw new Error(
        'PDF 를 올릴 권한이 없습니다. supabase/papers-setup.sql 의 4부(Storage papers/ 허용)를 실행했는지 확인해 주세요.',
      )
    }
    if (/Bucket not found/i.test(raw)) {
      throw new Error(`Storage 에 '${STORAGE_BUCKET}' 통이 없습니다.`)
    }
    throw new Error(`PDF 를 올리지 못했습니다. (${raw})`)
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return { path, url: data.publicUrl }
}

export async function createPaper(fields) {
  const { data, error } = await supabase.from('papers').insert(toRow(fields)).select().single()
  if (error) throw new Error(describe(error, '등록'))
  return data
}

export async function updatePaper(id, fields) {
  const { data, error } = await supabase
    .from('papers')
    .update(toRow(fields))
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(describe(error, '수정'))
  if (!data) throw new Error('수정 권한이 없거나 해당 논문을 찾지 못했습니다.')
  return data
}

export async function deletePaper(id) {
  const { error } = await supabase.from('papers').delete().eq('id', id)
  if (error) throw new Error(describe(error, '삭제'))
}

/** 빈 칸은 null 로 넣어 둡니다 (빈 글자보다 다루기 쉽습니다) */
function toRow(f) {
  const t = (v) => (v?.trim() ? v.trim() : null)

  return {
    title: f.title.trim(),
    authors: t(f.authors),
    venue: t(f.venue),
    year: t(f.year),
    doi: t(f.doi),
    link: t(f.link),
    pdf_url: t(f.pdfUrl),
    abstract: t(f.abstract),
    summary: t(f.summary),
    takeaways: t(f.takeaways),
    keywords: t(f.keywords),
    citations: f.citations === '' || f.citations == null ? null : Number(f.citations),
  }
}

function describe(error, what) {
  const code = error.code || ''
  const raw = error.message || ''

  if (code === '42P01') {
    return 'papers 표가 없습니다. supabase/papers-setup.sql 을 먼저 실행해 주세요.'
  }
  if (code === '42501' || /row-level security|permission denied/i.test(raw)) {
    return `${what} 권한이 없습니다. 관리자로 로그인했는지, papers-setup.sql 을 실행했는지 확인해 주세요.`
  }
  if (/JWT|expired/i.test(raw)) {
    return '로그인이 만료되었습니다. 다시 로그인해 주세요.'
  }
  return `${what}하지 못했습니다. (${raw || '알 수 없는 오류'})`
}
