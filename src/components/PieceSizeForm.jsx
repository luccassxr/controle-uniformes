/**
 * Cadastro de tamanho — salva na coleção uniformes (Firestore).
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from './PageLayout'
import SizeRadioGroup from './SizeRadioGroup'
import ShoeSizeSelect from './ShoeSizeSelect'
import AlertMessage from './AlertMessage'
import { useAuth } from '../context/AuthContext'
import { getUser, getUniforme, savePieceSize } from '../services/firestoreService'
import { required, validateForm, hasErrors } from '../utils/validation'

export default function PieceSizeForm({
  title,
  sizeLabel,
  pieceKey,
  mode = 'letter',
}) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [size, setSize] = useState('')
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      const uniforme = await getUniforme(user.uid)
      const saved = uniforme?.[pieceKey]
      if (saved) setSize(saved)
    }
    if (user) load()
  }, [user, pieceKey])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFeedback({ type: '', message: '' })

    const rules = {
      size: (v) =>
        required(v, mode === 'shoe' ? 'Selecione o tamanho do tênis' : 'Selecione o tamanho'),
    }
    const errs = validateForm({ size }, rules)
    setErrors(errs)
    if (hasErrors(errs)) return

    const profile = await getUser(user.uid)
    if (!profile?.matricula) {
      setFeedback({
        type: 'error',
        message: 'Cadastre primeiro seus dados em Cadastro de Uniformes.',
      })
      return
    }

    setSubmitting(true)
    try {
      await savePieceSize(user.uid, pieceKey, size)
      setFeedback({ type: 'success', message: 'Tamanho salvo com sucesso!' })
      setTimeout(() => navigate('/pecas'), 1500)
    } catch (err) {
      setFeedback({ type: 'error', message: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageLayout wide>
      <h2 className="card__title">{title}</h2>
      <AlertMessage type={feedback.type} message={feedback.message} />
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}
      >
        {mode === 'shoe' ? (
          <ShoeSizeSelect value={size} onChange={setSize} label={sizeLabel} />
        ) : (
          <SizeRadioGroup
            name={`tamanho-${pieceKey}`}
            value={size}
            onChange={setSize}
            label={sizeLabel}
          />
        )}
        {errors.size && <span className="field-error">{errors.size}</span>}
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Salvando...' : 'Cadastrar'}
        </button>
      </form>
      <button type="button" className="btn btn--outline" onClick={() => navigate('/pecas')}>
        Voltar
      </button>
    </PageLayout>
  )
}
