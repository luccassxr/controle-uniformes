/**
 * Tela inicial — boas-vindas, Login e Cadastrar.
 */
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

export default function Home() {
  return (
    <PageLayout logoSize="lg">
      <p className="card__subtitle" style={{ fontSize: '1.35rem', fontWeight: 600 }}>
        Bem-vindo ao site
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
        <Link to="/login" className="btn">
          Login
        </Link>
        <Link to="/cadastro" className="btn">
          Cadastrar
        </Link>
      </div>
    </PageLayout>
  )
}
