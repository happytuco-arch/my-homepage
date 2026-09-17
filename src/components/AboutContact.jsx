import { profile } from '../data/portfolio'
import { LinkedInIcon, SkkuLogo } from './Icons'

const ICONS = {
  linkedin: LinkedInIcon,
  'skku-game': SkkuLogo,
}

/**
 * 3번째 화면 — About (여백 중심 + 명세 한 줄).
 *
 * 가운데에 문장 하나만 세우고, 아래에 정보를 가로 한 줄로 얹습니다.
 * 사진은 두지 않습니다.
 *
 * ※ 영문 소개글을 여기에 둔 이유
 *   원래 자리는 src/data/portfolio.js 인데, 그 파일은 지금 다른 창에서
 *   수정 중입니다. 서로 덮어쓰는 일을 피하려고 이 파일에 적어 두었습니다.
 *   그쪽 작업이 끝나면 portfolio.js 로 옮기는 편이 정리에 좋습니다.
 */
const ABOUT = {
  // 한눈에 읽히도록 짧게. 긴 설명은 작품과 논문이 대신합니다.
  quote: 'I keep the judgement, not just the result.',
  line: 'Games teach through the body, papers through sentences. Both ask what makes learning feel good.',
  facts: [
    { label: 'Focus', value: 'Game systems · Learning experience' },
    { label: 'Tools', value: 'Unity · Aseprite · Python · React' },
    { label: 'Writing', value: 'HCI · Game studies · Education' },
    { label: 'Status', value: 'Open to collaboration' },
  ],
}

export default function AboutContact() {
  return (
    <div className="wrap about about--center">
      <div className="about__center">
        <p className="kicker">About</p>

        <blockquote className="about__quote">“{ABOUT.quote}”</blockquote>

        <p className="about__line">{ABOUT.line}</p>

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

      {/* 아래에 가로 한 줄로 얹는 명세 */}
      <dl className="about__specs">
        {ABOUT.facts.map((f) => (
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
