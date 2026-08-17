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
      <div className="welcome-block">
        <span className="eyebrow">Área do aluno</span>
        <h2 className="card__title">O que você deseja fazer?</h2>
        <p className="card__subtitle">
          Atualize seus dados e registre os tamanhos das peças do seu uniforme.
        </p>
      </div>

      <div className="feature-card">
        <div className="feature-card__icon">U</div>
        <div className="feature-card__content">
          <strong>Cadastro de uniforme</strong>
          <span>Informe matrícula, série e os tamanhos das peças.</span>
        </div>
      </div>

      <Link to="/uniformes" className="btn">
        Cadastrar meu uniforme
      </Link>
      <button type="button" className="btn btn--outline" onClick={handleLogout}>
        Sair da conta
      </button>
    </PageLayout>
  )
}
