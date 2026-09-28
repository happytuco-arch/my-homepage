import { useEffect, useState } from 'react'
import { useAssignments } from '../lib/useAssignments'

/**
 * 과제 제출물 — 글 목록 + 글 읽기.
 *
 * Anthropic 연구 팀 페이지와 같은 짜임입니다.
 *   목록 : 분류 · 날짜 / 큰 제목 / 짧은 설명 이 머리카락 선으로 구분되어 쌓입니다
 *   글   : 제목을 누르면 프롬프트와 결과물이 있는 읽기 화면으로 들어갑니다
 *
 * 과제가 매주 쌓여도 목록은 한 줄씩만 길어지므로 오래 버팁니다.
 */
export default function AssignmentsTab() {
  const { status, items, error, reload } = useAssignments()
  const [openId, setOpenId] = useState(null)

  const open = items.find((a) => a.id === openId) || null

  // 글로 들어가거나 나올 때는 화면 맨 위로
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [openId])

  if (open) return <Post item={open} onBack={() => setOpenId(null)} />

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
              <button key={a.id} className="post" onClick={() => setOpenId(a.id)}>
                <p className="post__meta">
                  {a.week && <span>{a.week}</span>}
                  {a.course && <span>{a.course}</span>}
                  <span>{a.dateLabel}</span>
                </p>
                <h3 className="post__title">{a.title}</h3>
                {a.note && <p className="post__sub">{a.note}</p>}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/* ---------- 글 한 편 ---------- */

function Post({ item, onBack }) {
  const [copied, setCopied] = useState(false)
  const images = item.attachments.filter((a) => a.isImage)
  const docs = item.attachments.filter((a) => !a.isImage)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(item.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <article className="wrap section article">
      <button className="article__back" onClick={onBack}>
        ← All assignments
      </button>

      <header className="article__head">
        <p className="post__meta">
          {item.week && <span>{item.week}</span>}
          {item.course && <span>{item.course}</span>}
          <span>{item.dateLabel}</span>
        </p>
        <h2 className="article__title">{item.title}</h2>
        {item.note && <p className="article__lead">{item.note}</p>}
      </header>

      {item.image && (
        <div className="article__cover">
          <img src={item.image} alt={item.title} decoding="async" />
        </div>
      )}

      {item.prompt && (
        <div className="prompt">
          <div className="prompt__bar">
            <span>Prompt</span>
            <button className="btn-ghost" type="button" onClick={copy}>
              {copied ? '복사됨' : '복사'}
            </button>
          </div>
          <pre className="prompt__body">{item.prompt}</pre>
        </div>
      )}

      {images.length > 0 && (
        <div className="shots">
          {images.map((a) => (
            <a key={a.url} href={a.url} target="_blank" rel="noopener noreferrer">
              <img src={a.url} alt={a.name} decoding="async" />
            </a>
          ))}
        </div>
      )}

      {docs.length > 0 && (
        <ul className="filelist filelist--work">
          {docs.map((a) => (
            <li className="filecard" key={a.url}>
              <span className="filecard__type">FILE</span>
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

      {item.resultUrl && (
        <p className="work__links">
          <a href={item.resultUrl} target="_blank" rel="noopener noreferrer">
            결과물 보기 →
          </a>
        </p>
      )}

      <button className="article__back article__back--foot" onClick={onBack}>
        ← All assignments
      </button>
    </article>
  )
}
