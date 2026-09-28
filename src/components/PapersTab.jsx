import { useMemo } from 'react'
import { papers as priorWork } from '../data/portfolio'
import Article from './Article'
import { usePapers } from '../lib/usePapers'
import { useReader } from '../lib/useReader'
import { paperToPost } from '../lib/toPost'

/**
 * Papers 화면.
 *
 * 등록한 논문(Supabase)과 코드에 적어 둔 선행연구를 한 목록으로 잇습니다.
 * 읽는 사람에게는 둘 다 '논문 글'이므로, 앞뒤로 이어 읽을 수 있어야 합니다.
 */
export default function PapersTab() {
  const { status, items, error, reload } = usePapers()

  // 선행연구도 등록한 논문과 같은 모양으로 맞춰 한 줄에 세웁니다
  const all = useMemo(() => {
    const prior = priorWork.map((p) => ({
      ...p,
      id: `prior-${p.id}`,
      pdf: '',
      kind: 'prior',
      keywords: p.keywords ?? [],
      takeaways: p.takeaways ?? [],
    }))
    return [...items.map((p) => ({ ...p, kind: 'mine' })), ...prior]
  }, [items])

  const reader = useReader(all)

  if (reader.open) {
    return (
      <Article
        post={paperToPost(reader.open)}
        onBack={reader.close}
        prev={reader.prev}
        next={reader.next}
        position={reader.position}
      />
    )
  }

  return (
    <section className="wrap section panel">
      <div className="section__head">
        <div>
          <p className="kicker">Papers</p>
          <h2 className="section__title">Papers</h2>
        </div>
        <p className="section__note">
          {items.length > 0
            ? `${items.length} registered, ${priorWork.length} prior works.`
            : 'Work this project builds on.'}
        </p>
      </div>

      <div className="panel__body">
        {status === 'loading' && (
          <div className="state" aria-live="polite" aria-busy="true">
            <p className="state__mark">Loading</p>
            <p className="state__title">Loading papers…</p>
          </div>
        )}

        {status === 'error' && (
          <div className="state state--error" role="alert">
            <p className="state__mark">Error</p>
            <p className="state__title">Could not load the papers.</p>
            <p className="state__text">{error}</p>
            <button className="btn-ghost" type="button" onClick={reload}>
              Retry
            </button>
          </div>
        )}

        <div className="postlist">
          {all.map((p) => (
            <button key={p.id} className="post" onClick={() => reader.openPost(p)}>
              <p className="post__meta">
                <span>{p.kind === 'mine' ? 'Registered' : 'Prior work'}</span>
                {p.venue && <span>{p.venue}</span>}
                {p.year && <span>{p.year}</span>}
                {p.citations != null && <span>Cited {p.citations}</span>}
              </p>
              <h3 className="post__title">{p.title}</h3>
              {p.summary && <p className="post__sub">{p.summary}</p>}
              <span className="post__go">Read →</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
