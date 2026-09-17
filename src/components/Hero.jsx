import { profile } from '../data/portfolio'

const TICKER = [
  'Now in Development',
  'Pixel Drift — 2026',
  'Devlog Archive',
  'Papers in Review',
  'Block Choir — Prototype',
  'Little Keeper — Released',
]

/**
 * 첫 화면 — 도록의 속표지.
 *
 * 로고 기호와 큰 워드마크를 걷어내고, 세리프 한 문장만 세워 둡니다.
 * 이름은 상단 메뉴에 이미 있으므로 여기서 다시 외치지 않습니다.
 */
export default function Hero() {
  return (
    <section className="wrap hero">
      <div className="hero__top">
        <p className="badge">
          <i />
          Now in development · {profile.year}
        </p>
        <p className="kicker">Seoul, Republic of Korea</p>
      </div>

      <p className="hero__label">Selected work — {profile.year}</p>

      <h1 className="hero__name">
        Games &amp;<br />
        research,
        <br />
        as a record.
      </h1>

      <div className="hero__body">
        <dl className="hero__meta">
          <div>
            <dt>Role</dt>
            <dd>{profile.role}</dd>
          </div>
          <div>
            <dt>Based in</dt>
            <dd>{profile.based}</dd>
          </div>
          <div>
            <dt>Contact</dt>
            <dd>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

export function Ticker() {
  const items = [...TICKER, ...TICKER]
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {items.map((t, i) => (
          <span key={i}>
            <b>◆</b> {t}
          </span>
        ))}
      </div>
    </div>
  )
}
