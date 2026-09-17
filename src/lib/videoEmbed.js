// ─────────────────────────────────────────────────────────────
//  영상 주소를 화면에 어떻게 띄울지 정합니다.
//
//  두 갈래가 있습니다 —
//    · 유튜브 · 비메오 주소  → 그 회사 재생기를 창(iframe)으로 끼워 넣습니다
//    · 그 밖의 주소(.mp4 등) → 브라우저 기본 재생기(<video>)로 틉니다
//
//  유튜브 주소를 <video> 에 넣으면 아무것도 안 나옵니다.
//  그 주소는 영상 파일이 아니라 '재생 화면이 있는 웹페이지'이기 때문입니다.
// ─────────────────────────────────────────────────────────────

/** 유튜브 주소에서 영상 번호만 뽑아냅니다 */
function youtubeId(url) {
  const m =
    url.match(/(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/(?:embed|shorts|v)\/)([\w-]{11})/i)
  return m?.[1] || ''
}

/** 비메오 주소에서 영상 번호만 뽑아냅니다 */
function vimeoId(url) {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d{6,})/i)
  return m?.[1] || ''
}

/**
 * @returns {{kind: 'embed'|'file', src: string} | null}
 */
export function videoSource(url) {
  const value = url?.trim()
  if (!value) return null

  const yt = youtubeId(value)
  if (yt) return { kind: 'embed', src: `https://www.youtube-nocookie.com/embed/${yt}` }

  const vm = vimeoId(value)
  if (vm) return { kind: 'embed', src: `https://player.vimeo.com/video/${vm}` }

  return { kind: 'file', src: value }
}

/** 관리자 화면에서 "이 주소가 링크형인가"를 알려 줄 때 씁니다 */
export function isEmbedUrl(url) {
  return videoSource(url)?.kind === 'embed'
}
