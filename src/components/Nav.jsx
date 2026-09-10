import Logo from './Logo'
import Wordmark from './Wordmark'

const LINKS = [
  { id: 'games', label: 'Games' },
  { id: 'images', label: 'Images' },
  { id: 'papers', label: 'Papers' },
  { id: 'about', label: 'About' },
]

export default function Nav({ view, onGo }) {
  // Games는 첫 화면의 두 번째 장, About은 세 번째 장으로 이동합니다.
  // Images·Papers는 각각 독립된 화면으로 전환됩니다.
  const isActive = (id) =>
    (id === 'images' && view === 'images') ||
    (id === 'papers' && view === 'papers') ||
    (id === 'games' && view === 'home')

  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <button className="nav__brand" onClick={() => onGo('top')}>
          <Logo className="logo logo--nav" />
          <Wordmark className="wordmark wordmark--nav" />
        </button>

        <nav className="nav__links" aria-label="주요 메뉴">
          {LINKS.map((l) => (
            <button
              key={l.id}
              className={`nav__link${isActive(l.id) ? ' is-active' : ''}`}
              onClick={() => onGo(l.id)}
              aria-current={isActive(l.id) ? 'page' : undefined}
            >
              {l.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
