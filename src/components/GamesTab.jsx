import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import Article from './Article'
import { useProjects } from '../lib/useProjects'
import { useReader } from '../lib/useReader'
import { projectToPost } from '../lib/toPost'

/** 한 화면에 걸 작품 수 — 대표작 1 + 오른쪽 2×2 */
const LEAD_COUNT = 5

/**
 * 작품을 걸 순서를 정합니다.
 *
 *  · 대표 작품('항상 첫 번째')이 있으면 언제나 맨 앞
 *  · 나머지는 올린 순서대로
 *
 * 예전에는 무작위로 골랐습니다. 볼 때마다 다른 작품이 걸리는 재미가
 * 있었지만, 무엇이 걸릴지 내가 정할 수 없고 "아까 본 그것"을 다시
 * 찾기도 어려웠습니다. 순서를 정해 두는 편이 낫습니다.
 */
function inOrder(items) {
  const lead = items.find((i) => i.pinned)
  return lead ? [lead, ...items.filter((i) => i !== lead)] : items
}

/**
 * Works — Supabase 의 projects 표에서 읽어 온 실제 작품을 보여 줍니다.
 *
 * 불러오는 중 · 등록된 작품 없음 · 불러오기 실패 를 각각 다르게 안내합니다.
 * 실패했을 때 예시 데이터로 덮지 않습니다. 화면이 멀쩡해 보이면
 * 연결이 끊긴 것을 눈치채지 못하기 때문입니다.
 */
export default function GamesTab({ expand = 0 }) {
  const { status, items, error, reload } = useProjects()
  const [showAll, setShowAll] = useState(false)
  // 작품 목록이 바뀔 때만 다시 셉니다
  const ordered = useMemo(() => inOrder(items), [items])
  // 화면에 걸린 작품들 사이를 이어서 볼 수 있게 합니다 (보이는 차례 그대로)
  const reader = useReader(ordered)

  /*
    상단 메뉴에서 Works 를 누르면 전체 목록을 폅니다.
    메뉴를 누른 사람은 '작품 몇 점'이 아니라 '작품 전부'를 보러 온 것입니다.
    (첫 화면에서 스크롤로 내려올 때는 예전처럼 고른 몇 점만 걸립니다)
  */
  useEffect(() => {
    if (expand > 0) setShowAll(true)
  }, [expand])

  /*
    목록을 편 뒤에 그 자리로 옮깁니다.

    두 가지를 피해야 했습니다 —
     · 펴기 전에 움직이면, 구역의 높이가 달라지면서 엉뚱한 곳에 섭니다.
       그래서 화면이 다 바뀐 뒤(useLayoutEffect)에 움직입니다.
     · 부드럽게(smooth) 움직이면 scroll-snap 이 첫 화면으로 되돌립니다.
  */
  useLayoutEffect(() => {
    if (expand === 0 || !showAll) return

    const el = document.getElementById('work')
    if (!el) return

    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navH, behavior: 'instant' })
  }, [expand, showAll])

  const shown = showAll ? ordered : ordered.slice(0, LEAD_COUNT)

  const note =
    status === 'ready' && items.length > 0
      ? `${shown.length} of ${items.length} — in the order they were added.`
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
                {ordered.map((item) => (
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
            {items.length > LEAD_COUNT && (
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
        ) : item.video ? (
          /*
            사진이 없고 영상만 있는 작품 — 엉뚱한 사진을 끌어다 쓰지 않고
            영상의 첫 장면을 그대로 보여 줍니다. (소리 없이, 멈춘 채로)
          */
          <video
            className="card__img"
            // #t=0.5 — 맨 첫 장면은 검은 화면인 경우가 많아 조금 뒤를 집습니다
            src={`${item.video}#t=0.5`}
            preload="metadata"
            muted
            playsInline
            aria-label={item.title}
          />
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
