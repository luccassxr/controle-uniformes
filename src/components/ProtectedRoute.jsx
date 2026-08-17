/**
 * Rotas protegidas — exige login; redireciona admin/aluno conforme o papel.
 */
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export function StudentRoute({ children }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />
  return children
}

export function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/menu" replace />
  return children
}

export function GuestRoute({ children }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <LoadingScreen />
  if (user) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/menu'} replace />
  }
  return children
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <p>Carregando...</p>
    </div>
  )
}
