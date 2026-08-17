/**
 * Abas Masculino / Feminino (e opcional Baby Look) para telas de medidas.
 */
import './GenderTabs.css'

export default function GenderTabs({ value, onChange, showBaby = false }) {
  const tabs = showBaby
    ? [
        { id: 'masculino', label: 'Masculino' },
        { id: 'feminino', label: 'Feminino' },
        { id: 'baby', label: 'Baby Look' },
      ]
    : [
        { id: 'masculino', label: 'Masculino' },
        { id: 'feminino', label: 'Feminino' },
      ]

  return (
    <div className="gender-tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={value === tab.id}
          className={`gender-tabs__btn ${value === tab.id ? 'is-active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
