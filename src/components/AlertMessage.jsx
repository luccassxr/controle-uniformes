/**
 * Mensagem de sucesso ou erro após ações do usuário.
 */
import './AlertMessage.css'

export default function AlertMessage({ type = 'info', message }) {
  if (!message) return null
  return (
    <div className={`alert alert--${type}`} role="alert">
      {message}
    </div>
  )
}
