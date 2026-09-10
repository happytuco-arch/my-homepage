import { profile } from '../data/portfolio'
import SmartImage from './SmartImage'
import { LinkedInIcon, SkkuLogo } from './Icons'

const ICONS = {
  linkedin: LinkedInIcon,
  'skku-game': SkkuLogo,
}

/**
 * 3번째 화면 — About.
 * 왼쪽은 사진과 기본 정보, 오른쪽은 소개 글과 연락 수단입니다.
 */
export default function AboutContact() {
  const [lead, ...rest] = profile.statement

  return (
    <div className="wrap about">
      <div className="section__head">
        <h2 className="section__title">About</h2>
        <p className="section__note">{profile.affiliation}</p>
      </div>

      <div className="about__body">
        <div className="about__media">
          <div className="profile__portrait">
            <SmartImage src="/images/dot-hero.svg" alt={`${profile.nameKo} 프로필 이미지`} />
          </div>

          <dl className="profile__facts">
            {profile.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="about__text">
          <p className="profile__lead">“{lead}”</p>

          <div className="profile__text">
            {rest.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="about__contact">
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
          </div>
        </div>
      </div>

      <div className="footer__row">
        <span>
          © {profile.year} {profile.nameEn}
        </span>
        <span>{profile.location}</span>
        <span>Built with React + Vite</span>
      </div>
    </div>
  )
}
