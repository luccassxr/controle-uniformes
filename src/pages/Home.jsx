import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

export default function Home() {
  return (
    <PageLayout logoSize="lg">
      <div className="welcome-block">
        <span className="eyebrow">Gestão de uniformes escolares</span>
        <h1 className="card__title">Bem-vindo ao UniControl</h1>
        <p className="card__subtitle">
          Cadastre seus dados e tamanhos de uniforme de forma rápida e organizada.
        </p>
      </div>

      <div className="action-stack">
        <Link to="/login" className="btn">
          Entrar
        </Link>
        <Link to="/cadastro" className="btn btn--outline">
          Criar cadastro
        </Link>
      </div>

      <p className="helper-text">Acesso de alunos e administração em um só lugar.</p>
    </PageLayout>
  )
}
