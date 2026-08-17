/**
 * Marca UNICONTROL — tipografia condensada do protótipo.
 */
import './Logo.css'

export default function Logo({ size = 'md' }) {
  return (
    <h1 className={`logo logo--${size}`} aria-label="UNICONTROL">
      UNICONTROL
    </h1>
  )
}
