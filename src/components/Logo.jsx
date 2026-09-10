/**
 * JH Project 로고 — C · H · O를 한 덩어리로 합친 추상 기호.
 *
 *   O … 사각 링이 바깥 골격을 이룹니다
 *   C … 링의 오른쪽을 열어 두어 생기는 형태
 *   H … 그 사이를 관통하는 하늘색 가로대
 *
 * 글자를 나열하지 않고 겹쳐 하나의 문장(紋章)처럼 읽히도록 했습니다.
 * 곡선 없이 직선과 45도 사선만 사용합니다.
 */
export default function Logo({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="JH Project 로고"
    >
      {/* 배지 — 왼쪽 위 모서리를 45도로 잘라 낸 검정 판 */}
      <polygon points="12,0 64,0 64,52 52,64 0,64 0,12" fill="#14120f" />
      {/* 잘려 나간 오른쪽 아래 모서리를 하늘색으로 되채워 포인트 */}
      <polygon points="64,52 64,64 52,64" fill="#5cc8f2" />

      {/* 왼쪽 조각 — C */}
      <polygon points="18,13 29,13 29,20 20,20 20,44 29,44 29,51 13,51 13,18" fill="#ffffff" />

      {/* 오른쪽 조각 — C를 뒤집은 것. 둘이 마주 보며 O의 링을 이룹니다 */}
      <polygon points="35,13 51,13 51,46 46,51 35,51 35,44 44,44 44,20 35,20" fill="#ffffff" />

      {/* 둘을 잇는 가로대 — H */}
      <polygon points="20,28 44,28 44,36 20,36" fill="#5cc8f2" />
    </svg>
  )
}
