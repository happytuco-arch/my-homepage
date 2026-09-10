import { profile, games, papers } from '../data/portfolio'
import LogoMorph from './LogoMorph'

const TICKER = [
  'Now in Development',
  'Pixel Drift — 2026',
  'Devlog Archive',
  'Papers in Review',
  'Block Choir — Prototype',
  'Little Keeper — Released',
]

export default function Hero() {
  return (
    <section className="wrap hero">
      <div className="hero__top">
        <p className="badge">
          <i />
          Now in Development · {profile.year}
        </p>
        <p className="kicker">
          {games.length} Games — {papers.length} Papers
        </p>
      </div>

      <h1 className="hero__name">
        <LogoMorph compact className="logo logo--hero" />
        <span>{profile.nameKo}</span>
      </h1>

      <div className="hero__body">
        <blockquote className="hero__quote">“{profile.intro}”</blockquote>

        <dl className="hero__meta">
          <div>
            <dt>Role</dt>
            <dd>{profile.role}</dd>
          </div>
          <div>
            <dt>Based in</dt>
            <dd>{profile.location}</dd>
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
