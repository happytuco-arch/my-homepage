import Article from './Article'
import { useAssignments } from '../lib/useAssignments'
import { useReader } from '../lib/useReader'
import { assignmentToPost } from '../lib/toPost'

/**
 * 과제 제출물 — 글 목록 + 글 읽기.
 *
 * 목록은 분류 · 날짜 / 큰 제목 / 짧은 설명이 머리카락 선으로 나뉘어 쌓입니다.
 * 제목을 누르면 읽기 화면으로 들어가고, 거기서 이전·다음 글로 이어집니다.
 */
export default function AssignmentsTab() {
  const { status, items, error, reload } = useAssignments()
  const reader = useReader(items)

  if (reader.open) {
    return (
      <Article
        post={assignmentToPost(reader.open)}
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
          <p className="kicker">Coursework</p>
          <h2 className="section__title">Assignments</h2>
        </div>
        <p className="section__note">
          What I asked the AI, and what came back. Each entry keeps the prompt as it was written,
          alongside the files it produced.
        </p>
      </div>

      <div className="panel__body">
        {status === 'loading' && (
          <div className="state" aria-live="polite" aria-busy="true">
            <p className="state__mark">Loading</p>
            <p className="state__title">Loading assignments…</p>
          </div>
        )}

        {status === 'error' && (
          <div className="state state--error" role="alert">
            <p className="state__mark">Error</p>
            <p className="state__title">Could not load the assignments.</p>
            <p className="state__text">{error}</p>
            <button className="btn-ghost" type="button" onClick={reload}>
              Retry
            </button>
          </div>
        )}

        {status === 'ready' && items.length === 0 && (
          <div className="state">
            <p className="state__mark">Empty</p>
            <p className="state__title">No submissions yet.</p>
            <p className="state__text">The first entry will appear here.</p>
          </div>
        )}

        {status === 'ready' && items.length > 0 && (
          <div className="postlist">
            {items.map((a) => (
              <button key={a.id} className="post" onClick={() => reader.openPost(a)}>
                <p className="post__meta">
                  {a.week && <span>{a.week}</span>}
                  {a.course && <span>{a.course}</span>}
                  <span>{a.dateLabel}</span>
                </p>
                <h3 className="post__title">{a.title}</h3>
                {a.note && <p className="post__sub">{a.note}</p>}
                <span className="post__go">Read →</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
