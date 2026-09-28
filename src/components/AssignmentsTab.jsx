import { useState } from 'react'
import { useAssignments } from '../lib/useAssignments'

/**
 * 과제 제출물 화면.
 *
 * 이 화면의 주인공은 '프롬프트'입니다. AI 에게 무엇을 어떻게 물었는지가
 * 결과물만큼, 때로는 결과물보다 중요한 기록이라서 본문처럼 크게 싣습니다.
 */
export default function AssignmentsTab() {
  const { status, items, error, reload } = useAssignments()

  return (
    <section className="wrap section panel">
      <div className="section__head">
        <div>
          <p className="kicker">Coursework</p>
          <h2 className="section__title">Assignments</h2>
        </div>
        <p className="section__note">
          {status === 'ready' && items.length > 0
            ? `${items.length} submissions — newest first.`
            : 'Prompts and what came out of them.'}
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
            <p className="state__text">
              Sign in as admin and add one — a prompt, a note, and the result.
            </p>
          </div>
        )}

        {status === 'ready' && items.length > 0 && (
          <div className="worklist">
            {items.map((a) => (
              <Assignment key={a.id} item={a} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function Assignment({ item }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const images = item.attachments.filter((a) => a.isImage)
  const docs = item.attachments.filter((a) => !a.isImage)

  const long = item.prompt.length > 320
  const shown = open || !long ? item.prompt : `${item.prompt.slice(0, 320)}…`

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
    <article className="work">
      <header className="work__head">
        <p className="card__meta">
          <b>{item.index}</b>
          {item.week && <span>{item.week}</span>}
          {item.course && <span>{item.course}</span>}
          {item.dateLabel && <span>{item.dateLabel}</span>}
        </p>
        <h3 className="work__title">{item.title}</h3>
        {item.note && <p className="work__note">{item.note}</p>}
      </header>

      {item.image && (
        <div className="work__shot">
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

          <pre className="prompt__body">{shown}</pre>

          {long && (
            <button className="btn-ghost" type="button" onClick={() => setOpen((v) => !v)}>
              {open ? '접기' : '전체 보기'}
            </button>
          )}
        </div>
      )}

      {/* 올려 둔 프로젝트물 — 사진은 늘어놓고, 그 밖의 파일은 목록으로 */}
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
    </article>
  )
}
