import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero, { Ticker } from './components/Hero'
import GamesTab from './components/GamesTab'
import ImagesTab from './components/ImagesTab'
import PapersTab from './components/PapersTab'
import AboutContact from './components/AboutContact'
import DetailView from './components/DetailView'

/**
 * 화면 구성
 *
 *  view = 'home'    첫 화면 → Games → About &amp; Contact  (세 장을 스크롤로 넘김)
 *  view = 'images'  이미지만 있는 독립 화면
 *  view = 'papers'  논문만 있는 독립 화면
 */
export default function App() {
  const [view, setView] = useState('home')
  const [detail, setDetail] = useState(null)
  const [scrollTo, setScrollTo] = useState(null)

  // 상단 메뉴 클릭 처리
  const go = (target) => {
    setDetail(null)

    if (target === 'images' || target === 'papers') {
      setView(target)
      setScrollTo('top')
      return
    }

    setView('home')
    if (target === 'games') setScrollTo('work')
    else if (target === 'about' || target === 'contact') setScrollTo('contact')
    else setScrollTo('top')
  }

  // 화면이 바뀐 뒤에 이동합니다 (그려지기 전에 움직이면 엉뚱한 곳으로 갑니다)
  useEffect(() => {
    if (!scrollTo) return
    if (scrollTo === 'top') window.scrollTo({ top: 0, behavior: 'smooth' })
    else document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' })
    setScrollTo(null)
  }, [scrollTo, view])

  // 화면이 시야에 들어올 때만 내용을 떠오르게 합니다.
  // view가 바뀌면 장(章)이 새로 만들어지므로 다시 관찰합니다.
  useEffect(() => {
    const root = document.documentElement
    const panels = [...document.querySelectorAll('.snap')]

    if (typeof IntersectionObserver === 'undefined') return

    root.classList.add('anim-ready')

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
  }, [view])

  return (
    <>
      <Nav view={view} onGo={go} />

      <main>
        {view === 'home' && (
          <>
            {/* 1번째 화면 — 이름과 소개 */}
            <section className="snap snap--hero">
              <Hero />
              <Ticker />
            </section>

            {/* 2번째 화면 — Games */}
            <section className="snap snap--work" id="work">
              <GamesTab onOpen={setDetail} />
            </section>

            {/* 3번째 화면 — About &amp; Contact */}
            <section className="snap snap--about" id="contact">
              <AboutContact />
            </section>
          </>
        )}

        {view === 'images' && (
          <section className="snap snap--work snap--solo">
            <ImagesTab />
          </section>
        )}

        {view === 'papers' && (
          <section className="snap snap--work snap--solo">
            <PapersTab onOpen={setDetail} />
          </section>
        )}
      </main>

      {detail && <DetailView item={detail} onClose={() => setDetail(null)} />}
    </>
  )
}
