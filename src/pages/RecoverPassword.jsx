/**
 * Recuperar senha — Firebase envia link por e-mail para redefinição.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import FormField from '../components/FormField'
import AlertMessage from '../components/AlertMessage'
import { email, validateForm, hasErrors } from '../utils/validation'
import { resetPassword } from '../services/authService'

export default function RecoverPassword() {
  const [values, setValues] = useState({ email: '' })
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setValues({ email: e.target.value })
    setErrors({})
    setFeedback({ type: '', message: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateForm(values, { email: (v) => email(v) })
    setErrors(errs)
    if (hasErrors(errs)) return

    setLoading(true)
    try {
      await resetPassword(values.email.trim())
      setFeedback({
        type: 'success',
        message:
          'E-mail enviado! Verifique sua caixa de entrada e siga o link para criar uma nova senha.',
      })
    } catch (err) {
      setFeedback({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <h2 className="card__title">Recuperar senha</h2>
      <p className="card__subtitle">
        Informe seu e-mail cadastrado. Enviaremos um link para redefinir a senha.
      </p>
      <AlertMessage type={feedback.type} message={feedback.message} />
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}
      >
        <FormField
          label="Email de recuperação"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar link de recuperação'}
        </button>
      </form>
      <Link to="/login" className="btn btn--outline">
        Voltar ao login
      </Link>
    </PageLayout>
  )
}
