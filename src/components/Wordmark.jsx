/**
 * JH PROJECT 워드마크 (B-3안)
 *
 * J와 H는 글자를 직접 도형으로 그렸습니다. 수치는 옆의 PROJECT와 실측으로 맞췄습니다.
 *   대문자 높이 32  ·  획 두께 7  (Source Sans 3 Bold 700의 실측 세로획 = 7.03)
 *
 * H의 오른쪽 아래 모서리는 45도로 잘라, 옆에 놓이는 CHO 기호와 같은 언어를 씁니다.
 *
 * viewBox 높이가 곧 대문자 높이입니다. 따라서 CSS에서 height를 CHO 기호와 같은 값으로
 * 주면 글자의 위아래가 기호의 위아래와 정확히 맞습니다.
 */
export default function Wordmark({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 255 32"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="JH Project"
    >
      <g fill="currentColor">
        {/* J — 끝이 살짝 위로 올라간 갈고리 */}
        <polygon points="11,0 18,0 18,32 0,32 0,19 7,19 7,25 11,25" />

        {/* H — 오른쪽 아래 모서리를 45도로 자름 */}
        <polygon
          transform="translate(25 0)"
          points="0,0 7,0 7,12.5 18,12.5 18,0 25,0 25,27 20,32 18,32 18,19.5 7,19.5 7,32 0,32"
        />

        {/* PROJECT — 앞 글자와의 간격 12는 이 글꼴의 띄어쓰기 폭과 같습니다.
            textLength를 고정해 글꼴 로딩 전후로 폭이 흔들리지 않게 합니다. */}
        <text
          x="62"
          y="32"
          fontFamily="'Source Sans 3', 'Noto Sans KR', system-ui, sans-serif"
          fontSize="48"
          fontWeight="700"
          textLength="193"
          lengthAdjust="spacingAndGlyphs"
        >
          PROJECT
        </text>
      </g>
    </svg>
  )
}
