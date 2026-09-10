import { profile } from '../data/portfolio'
import SmartImage from './SmartImage'

export default function ProfileTab() {
  const [lead, ...rest] = profile.statement

  return (
    <section className="wrap section panel">
      <div className="section__head">
        <div>
          <p className="kicker">About</p>
          <h2 className="section__title">Profile</h2>
        </div>
        <p className="section__note">{profile.affiliation}</p>
      </div>

      <div className="panel__body">
        <div className="profile">
          <div className="profile__sticky">
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

          <div>
            <p className="profile__lead">“{lead}”</p>

            <div className="profile__text">
              {rest.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="profile__links">
              {profile.links.map((l) => (
                <a key={l.label} href={l.href}>
                  <b>{l.label}</b>
                  <span>{l.value}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
