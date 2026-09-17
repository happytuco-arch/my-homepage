import { useCallback, useEffect, useMemo, useState } from 'react'
import { AdminContext } from './AdminContext'
import { ADMIN_UID } from './config'
import { isSupabaseReady, supabase } from '../lib/supabase'

/**
 * 로그인 상태를 지킵니다.
 *
 * 로그인·로그아웃은 Supabase Auth 가 처리하고, 여기서는 그 결과만 받아 둡니다.
 * isAdmin 은 '화면을 보여 줄지' 정하는 값일 뿐입니다.
 * 실제로 등록·수정·삭제가 되는지는 서버(RLS)가 다시 검사합니다.
 */
export default function AdminProvider({ children }) {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(!isSupabaseReady)

  useEffect(() => {
    if (!supabase) return

    // 새로고침 직후 — 저장돼 있던 로그인 상태를 되살립니다
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
      setReady(true)
    })

    // 로그인 · 로그아웃 · 토큰 갱신을 계속 따라갑니다
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next ?? null)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const user = session?.user ?? null
  const isLoggedIn = Boolean(user)
  const isAdmin = user?.id === ADMIN_UID

  const login = useCallback(async (email, password) => {
    if (!supabase) throw new Error('Supabase 에 연결되어 있지 않습니다.')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(describeAuth(error))

    // 로그인은 됐지만 관리자가 아닌 계정이면 곧바로 내보냅니다
    if (data.user?.id !== ADMIN_UID) {
      await supabase.auth.signOut()
      throw new Error('관리자 계정이 아닙니다.')
    }
    return true
  }, [])

  const logout = useCallback(async () => {
    await supabase?.auth.signOut()
  }, [])

  const value = useMemo(
    () => ({ isAdmin, isLoggedIn, user, ready, login, logout }),
    [isAdmin, isLoggedIn, user, ready, login, logout],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

/** 로그인 오류를 한국어로 */
function describeAuth(error) {
  const raw = error.message || ''

  if (/Invalid login credentials/i.test(raw)) {
    return '이메일 또는 비밀번호가 맞지 않습니다.'
  }
  if (/Email not confirmed/i.test(raw)) {
    return '아직 이메일 승인이 끝나지 않은 계정입니다. Supabase → Authentication → Users 에서 확인해 주세요.'
  }
  if (/rate limit|Too many/i.test(raw)) {
    return '잠시 뒤에 다시 시도해 주세요. (짧은 시간에 너무 여러 번 시도했습니다)'
  }
  if (/fetch|network/i.test(raw)) {
    return '서버에 닿지 못했습니다. 인터넷 연결을 확인해 주세요.'
  }
  return `로그인하지 못했습니다. (${raw})`
}
