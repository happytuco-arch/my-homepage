import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero, { Ticker } from './components/Hero'
import GamesTab from './components/GamesTab'
import ImagesTab from './components/ImagesTab'
import PapersTab from './components/PapersTab'
import ProfileTab from './components/ProfileTab'
import DetailView from './components/DetailView'
import { profile, games, gallery, papers } from './data/portfolio'

const TABS = [
  { id: 'games', label: 'Games', count: games.length },
  { id: 'images', label: 'Images', count: gallery.length },
  { id: 'papers', label: 'Papers', count: papers.length },
  { id: 'profile', label: 'Profile', count: null },
]

export default function App() {
  const [tab, setTab] = useState('games')
  const [detail, setDetail] = useState(null)

  // 화면이 시야에 들어올 때만 내용을 떠오르게 합니다.
  // (JS가 준비된 뒤에 켜므로 스크립트 없이도 내용은 그대로 보입니다)
  useEffect(() => {
    const root = document.documentElement
    const panels = [...document.querySelectorAll('.snap')]

    // IntersectionObserver를 쓸 수 없으면 연출을 켜지 않습니다 (내용이 항상 보이도록)
    if (typeof IntersectionObserver === 'undefined') return

    root.classList.add('anim-ready')

    // 처음부터 화면에 걸쳐 있는 화면은 곧바로 보이게 합니다.
    // (탭이 백그라운드일 때는 관찰자가 늦게 깨어나므로 첫 화면이 비지 않도록)
    panels.forEach((p) => {
      const r = p.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) p.classList.add('is-in')
    })

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.target.classList.toggle('is-in', e.isIntersecting))
      },
      { threshold: 0.35 },
    )
    panels.forEach((p) => io.observe(p))

    return () => {
      io.disconnect()
      root.classList.remove('anim-ready')
    }
  }, [])

  const changeTab = (id) => {
    setTab(id)
    setDetail(null)
    // 탭을 고르면 2번째 화면으로 부드럽게 넘어갑니다
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Nav tab={tab} onTab={changeTab} />

      <main>
        {/* 1번째 화면 — 이름과 소개 */}
        <section className="snap snap--hero">
          <Hero />
          <Ticker />
        </section>

        {/* 2번째 화면 — Games / Papers / Profile */}
        <section className="snap snap--work" id="work">
          <div className="wrap">
            <div className="tabs" role="tablist" aria-label="포트폴리오 분류">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  className={`tab${tab === t.id ? ' is-active' : ''}`}
                  onClick={() => changeTab(t.id)}
                >
                  {t.label}
                  {t.count != null && <small>{String(t.count).padStart(2, '0')}</small>}
                </button>
              ))}
            </div>
          </div>

          {tab === 'games' && <GamesTab onOpen={setDetail} />}
          {tab === 'images' && <ImagesTab />}
          {tab === 'papers' && <PapersTab onOpen={setDetail} />}
          {tab === 'profile' && <ProfileTab />}
        </section>
      </main>

      {/* 3번째 화면 — 연락처 */}
      <footer className="footer snap" id="contact">
        <div className="wrap">
          <p className="kicker">Contact</p>
          <h2 className="footer__cta">
            Let’s make
            <br />
            <em>something</em> together.
          </h2>

          <a className="btn" href={`mailto:${profile.email}`}>
            {profile.email} <span aria-hidden="true">→</span>
          </a>

          <div className="footer__row">
            <span>
              © {profile.year} {profile.nameEn}
            </span>
            <span>{profile.affiliation}</span>
            <span>Built with React + Vite</span>
          </div>
        </div>
      </footer>

      {detail && <DetailView item={detail} onClose={() => setDetail(null)} />}
    </>
  )
}
