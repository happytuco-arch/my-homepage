import { useAdmin } from '../admin/AdminContext'

const LINKS = [
  { id: 'games', label: 'Works' },
  { id: 'papers', label: 'Papers' },
  { id: 'about', label: 'About' },
]

export default function Nav({ view, onGo, onAdmin }) {
  const { isAdmin } = useAdmin()

  // Works는 첫 화면의 두 번째 장, About은 세 번째 장으로 이동합니다.
  // Papers만 독립된 화면으로 전환됩니다.
  const isActive = (id) =>
    (id === 'papers' && view === 'papers') || (id === 'games' && view === 'home')

  return (
    <header className="nav">
      <div className="wrap nav__inner">
        {/* 기호 없이 글자만. 자간을 넓혀 도록 표지처럼 보이게 합니다 */}
        <button className="nav__brand" onClick={() => onGo('top')}>
          JH Project
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

          {/* 관리자 — 로그인 전에는 '관리자', 로그인 뒤에는 '올리기' 로 바뀝니다 */}
          <button
            className={`nav__link nav__link--admin${isAdmin ? ' is-on' : ''}`}
            onClick={onAdmin}
            title={isAdmin ? '작품 등록 · 수정 · 삭제' : '관리자 로그인'}
          >
            {isAdmin ? 'Manage' : 'Admin'}
          </button>
        </nav>
      </div>
    </header>
  )
}
