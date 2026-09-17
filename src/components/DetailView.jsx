import { useEffect } from 'react'
import SmartImage from './SmartImage'

/**
 * 상세 보기 — 왼쪽 이미지(또는 논문 표지) / 오른쪽 설명의 2단 구성.
 * 화면이 좁아지면 위아래 1단으로 바뀝니다.
 */
export default function DetailView({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  if (!item) return null

  const isPaper = Boolean(item.venue)

  const meta = isPaper
    ? [
        { label: 'Authors', value: item.authors },
        { label: 'Venue', value: item.venue },
        { label: 'Year', value: item.year },
        { label: 'Cited by', value: `${item.citations} (${item.citationSource}, ${item.checkedOn})` },
        { label: 'DOI', value: item.doi },
      ]
    : [
        { label: 'Year', value: item.year },
        { label: 'Role', value: item.role },
        { label: 'Stack', value: item.stack },
        { label: 'Status', value: item.status },
      ]

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button className="detail__close" onClick={onClose}>
        Close ✕
      </button>

      <article className="detail">
        <div className="detail__media">
          <span className="detail__index">{item.index}</span>

          {isPaper ? (
            // 논문은 표지 이미지가 없으므로 서지 정보로 표지를 대신합니다
            <div className="detail__cover">
              <p className="kicker">{item.venueNote}</p>
              <p className="detail__cover-venue">{item.venue}</p>
              <p className="detail__cover-year">{item.year}</p>
              <p className="detail__cover-cite">
                Cited by <b>{item.citations}</b>
                <br />
                {item.citationSource} · {item.checkedOn} 기준
              </p>
            </div>
          ) : (
            <SmartImage src={item.image} alt={item.title} />
          )}
        </div>

        <div className="detail__body">
          <p className="kicker">{isPaper ? 'Prior Work' : 'Game'}</p>
          <h2 className="detail__title">{item.title}</h2>
          <p className="detail__sub">{isPaper ? item.titleKo : item.subtitle}</p>

          <p className="detail__quote">“{isPaper ? item.summary : item.tagline}”</p>

          <p className="detail__text">{isPaper ? item.abstract : item.description}</p>

          <p className="detail__listlabel">
            {isPaper ? '이 프로젝트와의 연결 — 논문의 주장이 아니라 제가 받아들인 관점입니다' : '주요 작업'}
          </p>
          <ul className="detail__list">
            {(isPaper ? item.takeaways : item.highlights).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>

          {isPaper && (
            <>
              <div className="paper__keys">
                {item.keywords.map((k) => (
                  <span className="chip" key={k}>
                    #{k}
                  </span>
                ))}
              </div>

              <a className="btn" href={item.link} target="_blank" rel="noopener noreferrer">
                원문 보기 <span aria-hidden="true">→</span>
              </a>
            </>
          )}

          <dl className="detail__grid">
            {meta.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </article>
    </div>
  )
}
