import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero, { Ticker } from './components/Hero'
import GamesTab from './components/GamesTab'
import PapersTab from './components/PapersTab'
import AssignmentsTab from './components/AssignmentsTab'
import AboutContact from './components/AboutContact'
import AdminLogin from './components/AdminLogin'
import AdminPanel from './components/AdminPanel'
import AdminProvider from './admin/AdminProvider'
import { useAdmin } from './admin/AdminContext'

/**
 * 화면 구성
 *
 *  view = 'home'    첫 화면 → Works → About &amp; Contact  (세 장을 스크롤로 넘김)
 *  view = 'papers'  논문만 있는 독립 화면
 *
 *  사진·영상은 Works 가 Supabase 에서 불러와 함께 보여 주므로,
 *  따로 있던 Images 화면은 없앴습니다.
 */
export default function App() {
  return (
    <AdminProvider>
      <Site />
    </AdminProvider>
  )
}

function Site() {
  const { isAdmin } = useAdmin()
  const [view, setView] = useState('home')
  const [scrollTo, setScrollTo] = useState(null)
  // 'login' 또는 'panel' — 관리자 창이 열려 있는 상태
  const [admin, setAdmin] = useState(null)

  // 상단 메뉴 클릭 처리
  const go = (target) => {

    if (target === 'papers' || target === 'assignments') {
      setView(target)
      setScrollTo('top')
      return
    }

    setView('home')
    if (target === 'games') setScrollTo('work')
    else if (target === 'about' || target === 'contact') setScrollTo('contact')
    else setScrollTo('top')
  }

  /*
    관리자 화면으로 들어가는 길.

    상단에 단추를 두지 않으므로, 주소 끝에 #admin 을 붙이면 열립니다.
      https://…vercel.app/#admin
    열고 나서는 주소를 원래대로 되돌려, 화면에 흔적이 남지 않게 합니다.

    ※ 이것은 잠금장치가 아니라 가림막입니다. 진짜 보호는 비밀번호와
      Supabase 쪽 규칙(RLS)이 합니다.
  */
  useEffect(() => {
    const open = () => {
      if (window.location.hash.toLowerCase() !== '#admin') return
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      setAdmin(isAdmin ? 'panel' : 'login')
    }

    open()
    window.addEventListener('hashchange', open)
    return () => window.removeEventListener('hashchange', open)
  }, [isAdmin])

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

    /*
      한 번 드러난 장은 다시 숨기지 않습니다.

      예전에는 "장의 35%가 보일 때만 드러내기"였는데, 글이 길어지면
      장의 높이가 화면의 세 배를 넘어 35%가 영영 채워지지 않습니다.
      그러면 내용이 통째로 사라집니다(과제 글에서 실제로 그랬습니다).

      이제 조금이라도 보이면 드러내고, 그 뒤로는 관찰을 멈춥니다.
    */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        })
      },
      { threshold: 0.01 },
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
              <GamesTab />
            </section>

            {/* 3번째 화면 — About &amp; Contact */}
            <section className="snap snap--about" id="contact">
              <AboutContact />
            </section>
          </>
        )}

        {view === 'assignments' && (
          <section className="snap snap--work snap--solo">
            <AssignmentsTab />
          </section>
        )}

        {view === 'papers' && (
          <section className="snap snap--work snap--solo">
            <PapersTab />
          </section>
        )}
      </main>

      {admin === 'login' && (
        // 로그인에 성공하면 곧바로 올리기 화면으로 넘어갑니다
        <AdminLogin onClose={() => setAdmin(null)} onSuccess={() => setAdmin('panel')} />      )}
      {admin === 'panel' && <AdminPanel onClose={() => setAdmin(null)} />}
    </>
  )
}
