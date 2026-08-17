/**
 * Contexto global de autenticação — usuário logado e papel (admin/aluno).
 */
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { getUserProfile, ensureUserProfile } from '../services/authService'
import { ROLES } from '../constants/roles'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setProfile(null)
        setRole(null)
        setLoading(false)
        return
      }
      setUser(firebaseUser)
      try {
        const r = await ensureUserProfile(firebaseUser)
        const p = await getUserProfile(firebaseUser.uid)
        setProfile(p)
        setRole(r || p?.role || ROLES.STUDENT)
      } catch {
        setRole(ROLES.STUDENT)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const isAdmin = role === ROLES.ADMIN
  const isStudent = role === ROLES.STUDENT

  return (
    <AuthContext.Provider
      value={{ user, profile, role, loading, isAdmin, isStudent, setProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
