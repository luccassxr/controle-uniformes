/**
 * Fundo com ondas pretas nas laterais — elemento visual do protótipo PDF.
 */
import './WaveBackground.css'

export default function WaveBackground({ children }) {
  return (
    <div className="page-shell">
      <div className="wave wave--left" aria-hidden="true">
        <svg viewBox="0 0 120 800" preserveAspectRatio="none">
          <path
            d="M0,0 C80,120 40,280 100,400 C160,520 60,640 120,800 L0,800 Z"
            fill="#0a0a0a"
          />
          <path
            d="M0,80 C60,200 90,350 50,500 C10,650 70,720 0,800 L0,0 Z"
            fill="#141414"
            opacity="0.6"
          />
        </svg>
      </div>
      <div className="wave wave--right" aria-hidden="true">
        <svg viewBox="0 0 120 800" preserveAspectRatio="none">
          <path
            d="M120,0 C40,120 80,280 20,400 C-40,520 60,640 0,800 L120,800 Z"
            fill="#0a0a0a"
          />
          <path
            d="M120,80 C60,200 30,350 70,500 C110,650 50,720 120,800 L120,0 Z"
            fill="#141414"
            opacity="0.6"
          />
        </svg>
      </div>
      <main className="page-content">{children}</main>
    </div>
  )
}
