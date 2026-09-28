import { useAdmin } from '../admin/AdminContext'

const LINKS = [
  { id: 'games', label: 'Works' },
  { id: 'papers', label: 'Papers' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'about', label: 'About' },
]

export default function Nav({ view, onGo, onAdmin }) {
  const { isAdmin } = useAdmin()

  // Works는 첫 화면의 두 번째 장, About은 세 번째 장으로 이동합니다.
  // Papers만 독립된 화면으로 전환됩니다.
  const isActive = (id) =>
    (id === 'papers' && view === 'papers') ||
    (id === 'assignments' && view === 'assignments') ||
    (id === 'games' && view === 'home')

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

          {/*
            관리자 단추는 평소에 숨깁니다.
            들어가는 길은 주소 뒤에 #admin 을 붙이는 것입니다.
            로그인한 뒤에는 다시 나올 일이 잦으므로 그때만 보여 줍니다.
          */}
          {isAdmin && (
            <button
              className="nav__link nav__link--admin is-on"
              onClick={onAdmin}
              title="작품 · 논문 · 과제 등록"
            >
              Manage
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
