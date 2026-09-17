import { useEffect, useRef, useState } from 'react'
import { useAdmin } from '../admin/AdminContext'
import { LAST_EMAIL_KEY } from '../admin/config'

/** 이 브라우저에서 마지막으로 로그인한 이메일 (없으면 빈칸) */
function rememberedEmail() {
  try {
    return globalThis.localStorage?.getItem(LAST_EMAIL_KEY) || ''
  } catch {
    return ''
  }
}

/**
 * 관리자 로그인 창.
 * 비밀번호는 여기서 받아 Supabase 로 바로 보냅니다. 어디에도 저장하지 않습니다.
 */
export default function AdminLogin({ onClose, onSuccess }) {
  const { login } = useAdmin()
  const [email, setEmail] = useState(rememberedEmail)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(email, password)
      // 다음에 이 브라우저에서 열 때만 미리 채워지도록 기억해 둡니다
      try {
        globalThis.localStorage?.setItem(LAST_EMAIL_KEY, email)
      } catch {
        // 저장이 막혀 있어도 로그인에는 지장이 없습니다
      }
      onSuccess()
    } catch (err) {
      setError(err.message)
      // 비밀번호만 비우고 이메일은 남겨 둡니다 (다시 칠 필요가 없도록)
      setPassword('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-label="관리자 로그인"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <form className="adminbox adminbox--login" onSubmit={submit}>
        <p className="kicker">Admin</p>
        <h2 className="adminbox__title">관리자 로그인</h2>
        <p className="adminbox__lead">작품을 등록·수정·삭제하려면 로그인해 주세요.</p>

        <label className="field">
          <span className="field__label">이메일</span>
          <input
            className="field__input"
            type="email"
            value={email}
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">비밀번호</span>
          <input
            ref={inputRef}
            className="field__input"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && (
          <p className="adminbox__error" role="alert">
            {error}
          </p>
        )}

        <div className="adminbox__actions">
          <button className="btn btn--sm" type="submit" disabled={busy || !email || !password}>
            {busy ? '확인 중…' : '로그인'}
          </button>
          <button className="btn-ghost" type="button" onClick={onClose}>
            닫기
          </button>
        </div>

        <p className="adminbox__note">
          로그인은 Supabase 가 확인합니다. 비밀번호는 이 컴퓨터에도, 코드에도 저장되지 않습니다.
          등록·수정·삭제 권한은 지정된 관리자 계정 한 명에게만 있으며, 이는 서버 쪽 규칙(RLS)이
          다시 한 번 검사합니다.
        </p>
      </form>
    </div>
  )
}
