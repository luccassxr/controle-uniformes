import { Link, useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import { logoutUser } from '../services/authService'

const PECAS = [
  { path: '/pecas/camiseta', label: 'Camiseta', code: 'CM' },
  { path: '/pecas/jaqueta', label: 'Jaqueta', code: 'JQ' },
  { path: '/pecas/calca', label: 'Calça', code: 'CL' },
  { path: '/pecas/tenis', label: 'Tênis', code: 'TN' },
  { path: '/pecas/bermuda', label: 'Bermuda', code: 'BM' },
  { path: '/pecas/short-saia', label: 'Short saia', code: 'SS' },
]

export default function PieceSelection() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutUser()
    navigate('/', { replace: true })
  }

  return (
    <PageLayout wide>
      <div className="welcome-block">
        <span className="eyebrow">Tamanhos do uniforme</span>
        <h2 className="card__title">Escolha uma peça</h2>
        <p className="card__subtitle">Selecione a peça que deseja cadastrar ou atualizar.</p>
      </div>

      <div className="piece-grid">
        {PECAS.map((p) => (
          <Link key={p.path} to={p.path} className="piece-tile">
            <span className="piece-tile__icon">{p.code}</span>
            <span className="piece-tile__label">{p.label}</span>
            <span className="piece-tile__arrow">→</span>
          </Link>
        ))}
      </div>

      <div className="secondary-actions">
        <button type="button" className="btn btn--outline" onClick={() => navigate('/menu')}>
          Voltar ao menu
        </button>
        <button type="button" className="btn btn--outline" onClick={handleLogout}>
          Sair da conta
        </button>
      </div>
    </PageLayout>
  )
}
