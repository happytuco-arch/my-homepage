import { useState } from 'react'

/**
 * public/images 안의 이미지를 불러옵니다.
 * 파일이 없거나 불러오지 못하면 "이미지 자리" 표시를 대신 보여 줍니다.
 */
export default function SmartImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className="ph" role="img" aria-label={`${alt} — 이미지 준비 중`}>
        <span className="ph__mark">Image Slot</span>
        <span className="ph__path">{src || 'public/images/…'}</span>
      </div>
    )
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
