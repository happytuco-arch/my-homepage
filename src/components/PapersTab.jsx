import { papers as priorWork } from '../data/portfolio'
import { usePapers } from '../lib/usePapers'

/**
 * Papers 화면.
 *
 *  · 위쪽 — 관리자 화면에서 등록한 논문 (Supabase papers 표)
 *  · 아래쪽 — 코드에 적어 둔 선행연구 목록
 *
 * 등록한 논문이 하나라도 있으면 그쪽이 주인공이 되고,
 * 선행연구는 아래에 참고로 남습니다.
 */
export default function PapersTab({ onOpen }) {
  const { status, items, error, reload } = usePapers()
  const hasRegistered = status === 'ready' && items.length > 0

  return (
    <section className="wrap section panel">
      <div className="section__head">
        <div>
          <p className="kicker">Papers</p>
          <h2 className="section__title">Papers</h2>
        </div>
        <p className="section__note">
          {hasRegistered
            ? `${items.length} papers — newest first.`
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

        {hasRegistered && (
          <div className="masonry masonry--2">
            {items.map((p) => (
              <div className="masonry__item" key={p.id}>
                <PaperCard item={p} onOpen={onOpen} />
              </div>
            ))}
          </div>
        )}

        {/* 코드에 적어 둔 선행연구 — 등록한 논문이 있으면 아래로 내려갑니다 */}
        <div className={hasRegistered ? 'priorwork' : undefined}>
          {hasRegistered && <p className="uploaded__label">Prior work — reference</p>}

          <div className="masonry masonry--2">
            {priorWork.map((p) => (
              <div className="masonry__item" key={p.id}>
                <PaperCard item={p} onOpen={onOpen} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** 논문 카드 한 장 — 등록한 논문과 선행연구가 같은 모양을 씁니다 */
function PaperCard({ item, onOpen }) {
  return (
    <button className="paper" onClick={() => onOpen(item)}>
      <div className="paper__top">
        <span className="paper__index">{item.index}</span>
        {item.field && <span className="chip chip--key">{item.field}</span>}
        <span className="chip">{item.venue}</span>
      </div>

      <h3 className="paper__title">{item.title}</h3>
      <p className="paper__authors">
        {[item.authors, item.year].filter(Boolean).join(' · ')}
      </p>
      {item.summary && <p className="paper__summary">{item.summary}</p>}

      {item.keywords.length > 0 && (
        <div className="paper__keys">
          {item.keywords.map((k) => (
            <span className="chip" key={k}>
              #{k}
            </span>
          ))}
        </div>
      )}

      <div className="paper__foot">
        {item.citations != null && (
          <>
            <span>
              Cited by {item.citations} ({item.citationSource})
            </span>
            <i className="dot" />
          </>
        )}
        {item.pdf && (
          <>
            <span>PDF</span>
            <i className="dot" />
          </>
        )}
        <span>Read →</span>
      </div>
    </button>
  )
}
