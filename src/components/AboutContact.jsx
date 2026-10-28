import { about, profile } from '../data/portfolio'
import { LinkedInIcon, SkkuLogo } from './Icons'

const ICONS = {
  linkedin: LinkedInIcon,
  'skku-game': SkkuLogo,
}

/**
 * 3번째 화면 — About (여백 중심 + 명세 한 줄).
 *
 * 가운데에 문장 하나만 세우고, 아래에 정보를 가로 한 줄로 얹습니다.
 * 사진은 두지 않습니다. 글은 src/data/portfolio.js 의 about 에 있습니다.
 */
export default function AboutContact() {
  return (
    <div className="wrap about about--center">
      <div className="about__center">
        <p className="kicker">About</p>

        <blockquote className="about__quote">“{about.quote}”</blockquote>

        <p className="about__line">{about.line}</p>

        <a className="btn" href={`mailto:${profile.email}`}>
          {profile.email} <span aria-hidden="true">→</span>
        </a>

        <div className="about__social">
          {profile.social.map((s) => {
            const Icon = ICONS[s.id]
            return (
              <a
                key={s.id}
                className="social-link"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.note}
              >
                {Icon && <Icon className="social-link__icon" />}
                <b>{s.label}</b>
              </a>
            )
          })}
        </div>

        {/* 학회에서 화면을 보여 주면 상대가 찍는 디지털 명함 QR (public/card/) */}
        <a className="about__qr" href="/card/" target="_blank" rel="noopener noreferrer">
          <img src="/card/qr.svg" alt="디지털 명함 QR 코드" width="112" height="112" />
          <span>Scan for my digital card</span>
        </a>
      </div>

      {/* 아래에 가로 한 줄로 얹는 명세 */}
      <dl className="about__specs">
        {about.facts.map((f) => (
          <div key={f.label}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="footer__row">
        <span>© {profile.year} {profile.nameEn}</span>
        <span>{profile.location}</span>
        <span>Built with React + Vite</span>
      </div>
    </div>
  )
}
