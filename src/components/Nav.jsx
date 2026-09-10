import { profile } from '../data/portfolio'
import Logo from './Logo'

const LINKS = [
  { id: 'games', label: 'Games' },
  { id: 'images', label: 'Images' },
  { id: 'papers', label: 'Papers' },
  { id: 'profile', label: 'About' },
]

export default function Nav({ tab, onTab }) {
  const goContact = (e) => {
    e.preventDefault()
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <button
          className="nav__brand"
          onClick={() => {
            onTab('games')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <Logo className="logo logo--nav" />
          {profile.nameKo}
          <span>{profile.nameEn}</span>
        </button>

        <nav className="nav__links" aria-label="주요 메뉴">
          {LINKS.map((l) => (
            <button
              key={l.id}
              className={`nav__link${tab === l.id ? ' is-active' : ''}`}
              onClick={() => onTab(l.id)}
              aria-current={tab === l.id ? 'page' : undefined}
            >
              {l.label}
            </button>
          ))}
          <a className="nav__link" href="#contact" onClick={goContact}>
            Contact
          </a>
        </nav>
      </div>
    </header>
  )
}
