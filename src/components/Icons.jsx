import { useState } from 'react'

/** About 화면의 링크 아이콘들 */

/** LinkedIn 공식 아이콘 색(#0A66C2)을 그대로 씁니다 */
export function LinkedInIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="0" y="0" width="24" height="24" rx="3" fill="#0a66c2" />
      <g fill="#ffffff">
        <rect x="4.6" y="9.2" width="3.3" height="10.2" />
        <circle cx="6.25" cy="5.9" r="2" />
        <path d="M10.3 9.2h3.2v1.4c0.7-1.1 1.9-1.7 3.4-1.7 2.5 0 4.1 1.7 4.1 4.7v5.8h-3.3v-5.3c0-1.5-0.7-2.3-1.9-2.3-1.3 0-2.2 0.9-2.2 2.4v5.2h-3.3z" />
      </g>
    </svg>
  )
}

/**
 * 성균관대학교 로고.
 * public/images/skku-logo.jpg 파일을 사용하며,
 * 파일이 아직 없으면 아래 게임패드 기호가 대신 나옵니다.
 */
export function SkkuLogo({ className = '' }) {
  const [failed, setFailed] = useState(false)

  if (failed) return <GamePadIcon className={className} />

  return (
    <img
      className={className}
      src="/images/skku-logo.jpg"
      alt=""
      aria-hidden="true"
      onError={() => setFailed(true)}
    />
  )
}

/** 로고 파일이 없을 때 쓰는 대체 기호 */
export function GamePadIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <path
        d="M3 7h18v3h1v7h-3v-2h-3v2H8v-2H5v2H2v-7h1z"
        fill="currentColor"
      />
      <g fill="#ffffff">
        {/* 방향키 */}
        <rect x="5.5" y="11.5" width="4.5" height="1.5" />
        <rect x="7" y="10" width="1.5" height="4.5" />
        {/* 버튼 */}
        <rect x="15" y="10.5" width="1.8" height="1.8" />
        <rect x="17.5" y="12.5" width="1.8" height="1.8" />
      </g>
    </svg>
  )
}
