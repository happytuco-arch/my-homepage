import { useCallback, useState } from 'react'

/**
 * 목록 ↔ 글 읽기를 오가는 상태.
 *
 * 세 화면(Works · Papers · Assignments)이 같은 방식으로 동작해야 하므로
 * 여기에 모아 둡니다. 어느 글을 열었는지, 앞뒤에 무엇이 있는지 알려 줍니다.
 */
export function useReader(items) {
  const [openId, setOpenId] = useState(null)

  const at = items.findIndex((i) => i.id === openId)
  const open = at >= 0 ? items[at] : null

  const goTo = useCallback((item) => setOpenId(item?.id ?? null), [])
  const close = useCallback(() => setOpenId(null), [])

  const before = at > 0 ? items[at - 1] : null
  const after = at >= 0 && at < items.length - 1 ? items[at + 1] : null

  return {
    open,
    openPost: goTo,
    close,
    // Article 이 쓰는 모양 — 제목과 '가기' 동작을 함께 넘깁니다
    prev: before ? { title: before.title, go: () => setOpenId(before.id) } : null,
    next: after ? { title: after.title, go: () => setOpenId(after.id) } : null,
    position: at >= 0 ? `${at + 1} / ${items.length}` : '',
  }
}
