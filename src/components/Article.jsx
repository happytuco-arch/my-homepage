import { useEffect, useRef, useState } from 'react'
import { videoSource } from '../lib/videoEmbed'

/**
 * 게시물 읽기 화면 — Works · Papers · Assignments 가 함께 씁니다.
 *
 * 세 화면의 자료는 서로 다르지만(작품 / 논문 / 과제), 읽는 방식은 같아야
 * 합니다. 그래서 담는 그릇을 하나로 두고, 각 화면이 자기 자료를 이 모양으로
 * 옮겨 담습니다. (src/lib/toPost.js)
 *
 * 상호작용
 *   · 위아래에 목록으로 돌아가는 길
 *   · 이전 글 / 다음 글 — 목록으로 나가지 않고 이어서 읽습니다
 *   · ← → 키로도 넘어갑니다. Esc 는 목록으로.
 */
export default function Article({ post, onBack, prev, next, position }) {
  const [copied, setCopied] = useState(false)
  const root = useRef(null)

  /*
    글이 바뀌면 맨 위에서 다시 읽기 시작합니다.

    예전에는 window 를 0 으로 올렸는데, Works 의 글은 첫 화면(hero) 아래에
    있으므로 글이 아니라 첫 화면이 보였습니다 — 글을 보려면 직접 내려야 했습니다.
    이제 글 자체를 위쪽 띠 바로 아래로 올립니다.
  */
  useEffect(() => {
    const el = root.current
    if (!el) return

    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68
    const top = el.getBoundingClientRect().top + window.scrollY - navH - 12

    window.scrollTo({ top: Math.max(0, top), behavior: 'instant' })
  }, [post.id])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onBack()
      if (e.key === 'ArrowLeft' && prev) prev.go()
      if (e.key === 'ArrowRight' && next) next.go()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onBack, prev, next])

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(post.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const video = videoSource(post.video)

  return (
    <article className="wrap section article" key={post.id} ref={root}>
      <button className="article__back" onClick={onBack}>
        ← {post.backLabel}
      </button>

      <header className="article__head">
        <p className="post__meta">
          {post.metas.filter(Boolean).map((m) => (
            <span key={m}>{m}</span>
          ))}
        </p>
        <h2 className="article__title">{post.title}</h2>
        {post.lead && <p className="article__lead">{post.lead}</p>}

        {post.chips.length > 0 && (
          <div className="paper__keys article__chips">
            {post.chips.map((c) => (
              <span className="chip" key={c}>
                {c}
              </span>
            ))}
          </div>
        )}
      </header>

      {post.cover && (
        <div className="article__cover">
          <img src={post.cover} alt={post.title} decoding="async" />
        </div>
      )}

      {video && (
        <div className="article__cover">
          {video.kind === 'embed' ? (
            <iframe
              className="detail__video"
              src={video.src}
              title={`${post.title} video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video className="detail__video" src={video.src} poster={post.cover || undefined} controls preload="metadata" />
          )}
        </div>
      )}

      {post.body.map((p, i) => (
        <p className="article__text" key={i}>
          {p}
        </p>
      ))}

      {post.prompt && (
        <div className="prompt">
          <div className="prompt__bar">
            <span>Prompt</span>
            <button className="btn-ghost" type="button" onClick={copyPrompt}>
              {copied ? '복사됨' : '복사'}
            </button>
          </div>
          <pre className="prompt__body">{post.prompt}</pre>
        </div>
      )}

      {post.bullets.length > 0 && (
        <>
          {post.bulletsLabel && <p className="article__label">{post.bulletsLabel}</p>}
          <ul className="detail__list article__list">
            {post.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </>
      )}

      {post.images.length > 0 && (
        <div className="shots">
          {post.images.map((a) => (
            <a key={a.url} href={a.url} target="_blank" rel="noopener noreferrer">
              <img src={a.url} alt={a.name} decoding="async" />
            </a>
          ))}
        </div>
      )}

      {post.files.length > 0 && (
        <ul className="filelist filelist--work">
          {post.files.map((a) => (
            <li className="filecard" key={a.url}>
              <span className="filecard__type">{a.kind || 'FILE'}</span>
              <div className="filecard__meta">
                <b>{a.name}</b>
              </div>
              <a className="btn-ghost" href={a.url} target="_blank" rel="noopener noreferrer">
                열기 →
              </a>
            </li>
          ))}
        </ul>
      )}

      {post.links.length > 0 && (
        <p className="work__links">
          {post.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label} →
            </a>
          ))}
        </p>
      )}

      {post.facts.length > 0 && (
        <dl className="detail__grid article__facts">
          {post.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* 이어서 읽기 */}
      <nav className="articlenav">
        <button className="articlenav__side" onClick={() => prev?.go()} disabled={!prev}>
          {prev ? (
            <>
              <span>← 이전</span>
              <b>{prev.title}</b>
            </>
          ) : (
            <span className="articlenav__end">처음 글입니다</span>
          )}
        </button>

        <button className="articlenav__mid" onClick={onBack}>
          <b>{position}</b>
          <span>목록으로</span>
        </button>

        <button
          className="articlenav__side articlenav__side--next"
          onClick={() => next?.go()}
          disabled={!next}
        >
          {next ? (
            <>
              <span>다음 →</span>
              <b>{next.title}</b>
            </>
          ) : (
            <span className="articlenav__end">마지막 글입니다</span>
          )}
        </button>
      </nav>    </article>
  )
}
