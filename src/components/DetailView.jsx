import { useEffect } from 'react'
import SmartImage from './SmartImage'

/**
 * 작품 상세 보기 — 왼쪽 이미지 / 오른쪽 설명의 2단 구성.
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
        { label: 'Field', value: item.field },
        { label: 'Venue', value: item.venue },
        { label: 'Year', value: item.year },
        { label: 'Status', value: item.status },
      ]
    : [
        { label: 'Year', value: item.year },
        { label: 'Role', value: item.role },
        { label: 'Stack', value: item.stack },
        { label: 'Status', value: item.status },
      ]

  const list = isPaper ? item.contributions : item.highlights

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
          <SmartImage src={item.image} alt={item.title} />
        </div>

        <div className="detail__body">
          <p className="kicker">{isPaper ? 'Paper' : 'Game'}</p>
          <h2 className="detail__title">{item.title}</h2>
          <p className="detail__sub">{isPaper ? item.titleEn : item.subtitle}</p>

          <p className="detail__quote">“{isPaper ? item.summary : item.tagline}”</p>

          <p className="detail__text">{isPaper ? item.abstract : item.description}</p>

          <ul className="detail__list">
            {list.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>

          {isPaper && (
            <div className="paper__keys">
              {item.keywords.map((k) => (
                <span className="chip" key={k}>
                  #{k}
                </span>
              ))}
            </div>
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
