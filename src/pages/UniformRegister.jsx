/**
 * Cadastro de dados do aluno — coleção users (nome, matrícula, turno, série).
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import FormField from '../components/FormField'
import AlertMessage from '../components/AlertMessage'
import { useAuth } from '../context/AuthContext'
import { getUser, saveUserData } from '../services/firestoreService'
import { required, validateForm, hasErrors } from '../utils/validation'
import { TURNOS, SERIES } from '../data/mockData'

export default function UniformRegister() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [values, setValues] = useState({
    nome: '',
    matricula: '',
    turno: '',
    serie: '',
  })
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const data = await getUser(user.uid)
      if (data) {
        setValues({
          nome: data.nome || '',
          matricula: data.matricula || '',
          turno: data.turno || '',
          serie: data.serie || '',
        })
      }
    }
    if (user) load()
  }, [user])

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((err) => ({ ...err, [field]: null }))
    setFeedback({ type: '', message: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateForm(values, {
      nome: (v) => required(v, 'Informe o nome completo'),
      matricula: (v) => required(v, 'Informe a matrícula'),
      turno: (v) => required(v, 'Selecione o turno'),
      serie: (v) => required(v, 'Selecione a série'),
    })
    setErrors(errs)
    if (hasErrors(errs)) return

    setLoading(true)
    try {
      await saveUserData(user.uid, user.email, values)
      setFeedback({ type: 'success', message: 'Dados salvos com sucesso!' })
      setTimeout(() => navigate('/pecas'), 1200)
    } catch (err) {
      setFeedback({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <h2 className="card__title">Cadastro de Uniformes</h2>
      <AlertMessage type={feedback.type} message={feedback.message} />
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}
      >
        <FormField
          label="Nome completo"
          value={values.nome}
          onChange={handleChange('nome')}
          error={errors.nome}
          required
        />
        <FormField
          label="Matrícula"
          value={values.matricula}
          onChange={handleChange('matricula')}
          error={errors.matricula}
          required
        />
        <FormField
          label="Turno"
          value={values.turno}
          onChange={handleChange('turno')}
          options={TURNOS}
          error={errors.turno}
          required
        />
        <FormField
          label="Série"
          value={values.serie}
          onChange={handleChange('serie')}
          options={SERIES}
          error={errors.serie}
          required
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Salvando...' : 'Continuar'}
        </button>
      </form>
      <button type="button" className="btn btn--outline" onClick={() => navigate('/menu')}>
        Voltar
      </button>
    </PageLayout>
  )
}
