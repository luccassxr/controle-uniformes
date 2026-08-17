/**
 * Tela de Login — Firebase Auth; admin vai ao dashboard, aluno ao menu.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import FormField from '../components/FormField'
import AlertMessage from '../components/AlertMessage'
import { email, required, validateForm, hasErrors } from '../utils/validation'
import { loginUser } from '../services/authService'
import { ROLES } from '../constants/roles'

export default function Login() {
  const navigate = useNavigate()
  const [values, setValues] = useState({ email: '', senha: '' })
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((err) => ({ ...err, [field]: null }))
    setFeedback({ type: '', message: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateForm(values, {
      email: (v) => email(v),
      senha: (v) => required(v, 'Informe a senha'),
    })
    setErrors(errs)
    if (hasErrors(errs)) return

    setLoading(true)
    try {
      const { role } = await loginUser(values.email.trim(), values.senha)
      setFeedback({ type: 'success', message: 'Login realizado com sucesso!' })
      navigate(role === ROLES.ADMIN ? '/admin/dashboard' : '/menu', { replace: true })
    } catch (err) {
      setFeedback({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <h2 className="card__title">Login</h2>
      <AlertMessage type={feedback.type} message={feedback.message} />
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}
      >
        <FormField
          label="Email"
          type="email"
          value={values.email}
          onChange={handleChange('email')}
          error={errors.email}
          required
        />
        <FormField
          label="Senha"
          type="password"
          value={values.senha}
          onChange={handleChange('senha')}
          error={errors.senha}
          required
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <div className="link-row">
        <Link to="/recuperar-senha">esqueceu a senha</Link>
        <Link to="/cadastro">criar conta</Link>
      </div>
      <Link to="/" className="btn btn--outline">
        Voltar
      </Link>
    </PageLayout>
  )
}
