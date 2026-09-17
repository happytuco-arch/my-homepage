import { createContext, useContext } from 'react'

/**
 * 관리자 상태를 화면 어디서나 꺼내 쓸 수 있게 담아 두는 통로입니다.
 * 실제 내용은 AdminProvider 가 채웁니다.
 */
export const AdminContext = createContext(null)

export function useAdmin() {
  const value = useContext(AdminContext)
  if (!value) throw new Error('useAdmin 은 AdminProvider 안에서만 쓸 수 있습니다.')
  return value
}
