/**
 * Rotas SPA do UNICONTROL — rotas públicas, aluno e administrador.
 */
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RecoverPassword from './pages/RecoverPassword'
import MainMenu from './pages/MainMenu'
import UniformRegister from './pages/UniformRegister'
import PieceSelection from './pages/PieceSelection'
import AdminDashboard from './pages/admin/AdminDashboard'
import CamisetaSize from './pages/pieces/CamisetaSize'
import JaquetaSize from './pages/pieces/JaquetaSize'
import CalcaSize from './pages/pieces/CalcaSize'
import BermudaSize from './pages/pieces/BermudaSize'
import ShortSaiaSize from './pages/pieces/ShortSaiaSize'
import TenisSize from './pages/pieces/TenisSize'
import { StudentRoute, AdminRoute, GuestRoute } from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/cadastro"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />
      <Route
        path="/recuperar-senha"
        element={
          <GuestRoute>
            <RecoverPassword />
          </GuestRoute>
        }
      />
      <Route
        path="/menu"
        element={
          <StudentRoute>
            <MainMenu />
          </StudentRoute>
        }
      />
      <Route
        path="/uniformes"
        element={
          <StudentRoute>
            <UniformRegister />
          </StudentRoute>
        }
      />
      <Route
        path="/pecas"
        element={
          <StudentRoute>
            <PieceSelection />
          </StudentRoute>
        }
      />
      <Route
        path="/pecas/camiseta"
        element={
          <StudentRoute>
            <CamisetaSize />
          </StudentRoute>
        }
      />
      <Route
        path="/pecas/jaqueta"
        element={
          <StudentRoute>
            <JaquetaSize />
          </StudentRoute>
        }
      />
      <Route
        path="/pecas/calca"
        element={
          <StudentRoute>
            <CalcaSize />
          </StudentRoute>
        }
      />
      <Route
        path="/pecas/bermuda"
        element={
          <StudentRoute>
            <BermudaSize />
          </StudentRoute>
        }
      />
      <Route
        path="/pecas/short-saia"
        element={
          <StudentRoute>
            <ShortSaiaSize />
          </StudentRoute>
        }
      />
      <Route
        path="/pecas/tenis"
        element={
          <StudentRoute>
            <TenisSize />
          </StudentRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      {/* Rota antiga redireciona para o dashboard */}
      <Route path="/painel" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
