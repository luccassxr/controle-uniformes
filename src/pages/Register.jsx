/**
 * Cadastro de aluno — nome, e-mail e senha no Firebase Auth + Firestore.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import FormField from '../components/FormField'
import AlertMessage from '../components/AlertMessage'
import {
  email,
  required,
  matchFields,
  minLength,
  validateForm,
  hasErrors,
} from '../utils/validation'
import { registerStudent } from '../services/authService'

export default function Register() {
  const navigate = useNavigate()
  const [values, setValues] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmar: '',
  })
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
      nome: (v) => required(v, 'Informe o nome'),
      email: (v) => email(v),
      senha: (v) => minLength(v, 6, 'Senha com no mínimo 6 caracteres'),
      confirmar: (v, all) =>
        matchFields(all.senha, v, 'As senhas não coincidem') ||
        required(v, 'Confirme a senha'),
    })
    setErrors(errs)
    if (hasErrors(errs)) return

    setLoading(true)
    try {
      await registerStudent(values.nome.trim(), values.email.trim(), values.senha)
      setFeedback({
        type: 'success',
        message: 'Conta criada! Faça login para continuar.',
      })
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setFeedback({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <h2 className="card__title">Cadastro</h2>
      <AlertMessage type={feedback.type} message={feedback.message} />
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}
      >
        <FormField
          label="Nome"
          value={values.nome}
          onChange={handleChange('nome')}
          error={errors.nome}
          required
        />
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
        <FormField
          label="Confirmar senha"
          type="password"
          value={values.confirmar}
          onChange={handleChange('confirmar')}
          error={errors.confirmar}
          required
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Confirmar'}
        </button>
      </form>
      <div className="link-row">
        <Link to="/login">Já tenho conta</Link>
      </div>
    </PageLayout>
  )
}
