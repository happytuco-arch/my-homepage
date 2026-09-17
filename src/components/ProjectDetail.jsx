import { useEffect } from 'react'
import { videoSource } from '../lib/videoEmbed'

/**
 * Supabase 에서 읽어 온 작품 하나를 크게 보여 줍니다.
 * 예시 데이터용 DetailView 와 담고 있는 칸이 달라서 따로 두었습니다.
 */
export default function ProjectDetail({ item, onClose }) {
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

  // 유튜브·비메오면 그 회사 재생기를, 영상 파일이면 기본 재생기를 씁니다
  const video = videoSource(item.video)

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

          {item.image ? (
            <img src={item.image} alt={item.title} />
          ) : (
            <div className="ph" role="img" aria-label={`${item.title} — no image`}>
              <span className="ph__mark">No Image</span>
              <span className="ph__path">image_url is empty</span>
            </div>
          )}
        </div>

        <div className="detail__body">
          <p className="kicker">Work</p>
          <h2 className="detail__title">{item.title}</h2>
          {item.dateLabel && <p className="detail__sub">{item.dateLabel}</p>}

          {item.description && <p className="detail__text">{item.description}</p>}

          {video && (
            <>
              <p className="detail__listlabel">Video</p>
              {video.kind === 'embed' ? (
                <iframe
                  className="detail__video"
                  src={video.src}
                  title={`${item.title} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                // 사진이 있으면 재생 전 첫 화면으로 씁니다 (없으면 검은 화면)
                <video
                  className="detail__video"
                  src={video.src}
                  poster={item.image || undefined}
                  controls
                  preload="metadata"
                />
              )}
            </>
          )}

          <dl className="detail__grid">
            <div>
              <dt>Registered</dt>
              <dd>{item.dateLabel || '—'}</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>Supabase · projects</dd>
            </div>
          </dl>
        </div>
      </article>
    </div>
  )
}
