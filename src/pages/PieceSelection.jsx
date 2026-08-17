/**
 * Seleção de peças do uniforme.
 */
import { Link, useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import { logoutUser } from '../services/authService'

const PECAS = [
  { path: '/pecas/camiseta', label: 'Cadastrar camiseta' },
  { path: '/pecas/jaqueta', label: 'Cadastrar jaqueta' },
  { path: '/pecas/calca', label: 'Cadastrar calça' },
  { path: '/pecas/tenis', label: 'Cadastrar tênis' },
  { path: '/pecas/bermuda', label: 'Cadastrar bermuda' },
  { path: '/pecas/short-saia', label: 'Cadastrar short saia' },
]

export default function PieceSelection() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutUser()
    navigate('/', { replace: true })
  }

  return (
    <PageLayout wide>
      <h2 className="card__title" style={{ marginBottom: '0.5rem' }}>
        Peças do uniforme
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%' }}>
        {PECAS.map((p) => (
          <Link key={p.path} to={p.path} className="btn">
            {p.label}
          </Link>
        ))}
      </div>
      <button type="button" className="btn btn--outline" onClick={() => navigate('/menu')}>
        Voltar
      </button>
      <button type="button" className="btn btn--outline" onClick={handleLogout}>
        Sair
      </button>
    </PageLayout>
  )
}
