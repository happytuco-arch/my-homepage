import { useMemo, useState } from 'react'
import Article from './Article'
import { useProjects } from '../lib/useProjects'
import { useReader } from '../lib/useReader'
import { projectToPost } from '../lib/toPost'

/**
 * 화면에 걸 작품을 고릅니다.
 *
 *  · 대표 작품(항상 첫 번째)은 언제나 맨 앞에 옵니다
 *  · 나머지는 그중 두세 점만 무작위로 골라 겁니다
 *
 * 고르는 일은 화면을 열 때 한 번만 합니다. 스크롤하다 그림이 바뀌면 어지럽습니다.
 */
function pickForDisplay(items) {
  const lead = items.find((i) => i.pinned) ?? items[0]
  const rest = items.filter((i) => i !== lead)

  // 네 점 — 오른쪽에 2×2 로 걸립니다
  const want = Math.min(rest.length, 4)

  const pool = [...rest]
  const picked = []
  while (picked.length < want) {
    picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
  }

  return lead ? [lead, ...picked] : []
}

/**
 * Works — Supabase 의 projects 표에서 읽어 온 실제 작품을 보여 줍니다.
 *
 * 불러오는 중 · 등록된 작품 없음 · 불러오기 실패 를 각각 다르게 안내합니다.
 * 실패했을 때 예시 데이터로 덮지 않습니다. 화면이 멀쩡해 보이면
 * 연결이 끊긴 것을 눈치채지 못하기 때문입니다.
 */
export default function GamesTab() {
  const { status, items, error, reload } = useProjects()
  const [showAll, setShowAll] = useState(false)
  // 화면에 걸린 작품들 사이를 이어서 볼 수 있게 합니다
  const reader = useReader(items)

  // 화면을 열 때 한 번만 고릅니다 (작품 목록이 바뀌면 다시 고릅니다)
  const selection = useMemo(() => pickForDisplay(items), [items])
  const shown = showAll ? items : selection

  const note =
    status === 'ready' && items.length > 0
      ? `${shown.length} of ${items.length} — the selection changes each visit.`
      : 'From the projects table.'

  if (reader.open) {
    return (
      <Article
        post={projectToPost(reader.open)}
        onBack={reader.close}
        prev={reader.prev}
        next={reader.next}
        position={reader.position}
      />
    )
  }

  return (
    // 전체 보기를 켜면 한 화면에 가두던 제한을 풉니다
    <section className={`wrap section panel${showAll ? ' panel--expanded' : ''}`}>
      <div className="section__head">
        <div>
          <p className="kicker">Selected Works</p>
          <h2 className="section__title">Works</h2>
        </div>
        <p className="section__note">{note}</p>
      </div>

      <div className="panel__body">
        {status === 'loading' && <LoadingState />}

        {status === 'error' && <ErrorState message={error} onRetry={reload} />}

        {status === 'ready' && items.length === 0 && <EmptyState />}

        {status === 'ready' && items.length > 0 && (
          <>
            {/*
              고른 몇 점을 걸 때와 전부를 걸 때는 배치가 달라야 합니다.
              몇 점일 때는 대표작을 크게(왼쪽 1 + 오른쪽 2×2),
              전부일 때는 크기가 같은 칸을 줄 맞춰 늘어놓습니다 — 목록이니까요.
            */}
            {showAll ? (
              <div className="allworks">
                {items.map((item) => (
                  <ProjectCard key={item.id} item={item} size="sm" onOpen={reader.openPost} />
                ))}
              </div>
            ) : (
              <div className="feature">
                <ProjectCard item={shown[0]} size="lg" onOpen={reader.openPost} />

                {shown.length > 1 && (
                  <div className="feature__side">
                    {shown.slice(1).map((item) => (
                      <ProjectCard key={item.id} item={item} size="sm" onOpen={reader.openPost} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 가려진 작품이 있을 때만 — 보고 싶은 사람은 전부 볼 수 있게 */}
            {items.length > selection.length && (
              <button
                className="showall"
                type="button"
                onClick={() => setShowAll((v) => !v)}
              >
                {showAll ? 'Show a selection' : `View all ${items.length} works`}
              </button>
            )}
          </>
        )}
      </div>
    </section>
  )
}

/* ---------- 작품 카드 ---------- */

function ProjectCard({ item, size, onOpen }) {
  return (
    <button className={`card card--${size}`} onClick={() => onOpen(item)}>
      {/* 그림 위에는 아무것도 얹지 않습니다 — 번호와 갈래는 아래 설명으로 내렸습니다 */}
      <div className="card__figure">
        {item.image ? (
          // 한 번에 두세 점만 걸므로 미루지 않고 바로 불러옵니다.
          // loading="lazy" 를 쓰면 화면 안에 들어와도 불러오지 않는 경우가 있었습니다.
          <img className="card__img" src={item.image} alt={item.title} decoding="async" />
        ) : (
          <div className="ph" role="img" aria-label={`${item.title} — no image`}>
            <span className="ph__mark">No image</span>
            <span className="ph__path">image_url is empty</span>
          </div>
        )}
      </div>

      <div className="card__body">
        <p className="card__meta">
          <b>{item.index}</b>
          {item.dateLabel && <span>{item.dateLabel}</span>}
          {item.video && <span>Video</span>}
        </p>
        <h3 className="card__title">{item.title}</h3>
        {item.description && <p className="card__sub">{item.description}</p>}
        <span className="card__more">View</span>
      </div>
    </button>
  )
}

/* ---------- 세 가지 상태 안내 ---------- */

/** ① 불러오는 중 */
function LoadingState() {
  return (
    <div className="state" aria-live="polite" aria-busy="true">
      <p className="state__mark">Loading</p>
      <p className="state__title">Loading works…</p>
      <p className="state__text">Fetching from Supabase.</p>

      {/* 글자만 있으면 허전해서, 카드가 들어올 자리를 미리 그려 둡니다 */}
      <div className="skeleton" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

/** ② 등록된 작품이 없음 (연결은 정상) */
function EmptyState() {
  return (
    <div className="state">
      <p className="state__mark">Empty</p>
      <p className="state__title">No works yet.</p>
      <p className="state__text">
        Connection is fine. Add a row to the <code>projects</code> table and it appears here.
      </p>
      <p className="state__hint">
        Sign in with Admin, or use Supabase → Table Editor → projects → Insert row.
      </p>
    </div>
  )
}

/** ③ 불러오기 실패 — 예시 데이터로 가리지 않고 그대로 알립니다 */
function ErrorState({ message, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <p className="state__mark">Error</p>
      <p className="state__title">Could not load the works.</p>
      <p className="state__text">{message}</p>
      <p className="state__hint">
        Settings live in <code>my-homepage/.env.local</code>. After changing them, restart the dev
        server (Ctrl+C, then <code>npm run dev</code>).
      </p>
      <button className="btn-ghost" type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}
