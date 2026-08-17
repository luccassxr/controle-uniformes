/**
 * Cartão branco arredondado — container padrão das telas.
 */
import './Card.css'

export default function Card({ children, wide = false, className = '' }) {
  return (
    <section
      className={`card ${wide ? 'card--wide' : ''} ${className}`.trim()}
    >
      {children}
    </section>
  )
}
