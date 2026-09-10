/**
 * 로고 변천 애니메이션 — C · H · O 세 글자가 모여 하나의 기호가 되는 과정.
 *
 * 1단계  세 글자가 떨어진 자리에서 차례로 나타납니다
 * 2단계  바깥의 C와 O가 가운데로 모여듭니다
 * 3단계  글자가 사라지고 그 자리에 지금의 로고가 맺힙니다
 *
 * compact = true  … 정사각형(64×64). 내비게이션·첫 화면처럼 글자 옆에 붙는 자리용.
 * compact = false … 가로로 긴 형태(150×88). 연락처 화면에서 크게 보여 주는 용도.
 *
 * 재생은 CSS가 맡습니다. 화면에 .is-in 이 붙거나(스크롤 진입) 내비게이션에 놓이면 시작합니다.
 * (스크립트가 없으면 애니메이션 없이 완성된 로고만 보입니다)
 */
export default function LogoMorph({ className = '', compact = false }) {
  const viewBox = compact ? '0 0 64 64' : '0 0 150 88'
  const markPos = compact ? 'translate(0 0)' : 'translate(24 12)'
  const letterPos = compact
    ? {
        c: 'translate(3 20) scale(0.78)',
        h: 'translate(25 20) scale(0.78)',
        o: 'translate(47 20) scale(0.78)',
      }
    : { c: 'translate(6 28)', h: 'translate(47 28)', o: 'translate(88 28)' }

  return (
    <svg
      className={`morph ${compact ? 'morph--compact' : 'morph--wide'} ${className}`.trim()}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="C, H, O 세 글자가 모여 JH Project 로고가 되는 과정"
    >
      {/* ── 완성형: 검정 배지 ── */}
      <g className="morph__badge">
        <g transform={markPos}>
          <polygon points="12,0 64,0 64,52 52,64 0,64 0,12" fill="#14120f" />
          <polygon points="64,52 64,64 52,64" fill="#5cc8f2" />
        </g>
      </g>

      {/* ── 완성형: 기호 ── */}
      <g className="morph__mark">
        <g transform={markPos}>
          <polygon points="18,13 29,13 29,20 20,20 20,44 29,44 29,51 13,51 13,18" fill="#ffffff" />
          <polygon points="35,13 51,13 51,46 46,51 35,51 35,44 44,44 44,20 35,20" fill="#ffffff" />
          <polygon points="20,28 44,28 44,36 20,36" fill="#5cc8f2" />
        </g>
      </g>

      {/* ── 처음 버전의 글자들 (각진 C · H · O) ── */}
      <g transform={letterPos.c}>
        <g className="morph__letter morph__c">
          <polygon
            points="14,0 18,4 18,6 6,6 6,26 18,26 18,28 14,32 4,32 0,28 0,4 4,0"
            fill="#14120f"
          />
        </g>
      </g>

      <g transform={letterPos.h}>
        <g className="morph__letter morph__h">
          <polygon
            points="3,0 6,0 6,13 12,13 12,0 18,0 18,29 15,32 12,32 12,19 6,19 6,32 0,32 0,3"
            fill="#2f9fd0"
          />
        </g>
      </g>

      <g transform={letterPos.o}>
        <g className="morph__letter morph__o">
          <path
            d="M3,0 H18 V29 L15,32 H0 V3 Z M6,6 V26 H12 V6 Z"
            fill="#14120f"
            fillRule="evenodd"
          />
        </g>
      </g>
    </svg>
  )
}
