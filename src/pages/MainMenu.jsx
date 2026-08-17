/**
 * Menu principal do aluno — uniforme e logout real.
 */
import { Link, useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import { logoutUser } from '../services/authService'

export default function MainMenu() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutUser()
    navigate('/', { replace: true })
  }

  return (
    <PageLayout logoSize="lg">
      <p className="card__subtitle" style={{ fontSize: '1.2rem', fontWeight: 600 }}>
        O que você deseja?
      </p>
      <Link to="/uniformes" className="btn" style={{ textAlign: 'center', lineHeight: 1.2 }}>
        Clique para cadastrar seu tamanho de uniforme
      </Link>
      <button type="button" className="btn btn--outline" onClick={handleLogout}>
        Sair
      </button>
    </PageLayout>
  )
}
