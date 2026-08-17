/**
 * Seleção de tamanho (PP, P, M, G, GG, EGG) como no protótipo.
 */
import './SizeRadioGroup.css'

export default function SizeRadioGroup({ name, value, onChange, label = 'Tamanho' }) {
  const sizes = ['PP', 'P', 'M', 'G', 'GG', 'EGG']

  return (
    <fieldset className="size-radio">
      <legend className="size-radio__legend">{label}</legend>
      <div className="size-radio__grid">
        {sizes.map((s) => (
          <label key={s} className={`size-radio__item ${value === s ? 'is-active' : ''}`}>
            <input
              type="radio"
              name={name}
              value={s}
              checked={value === s}
              onChange={() => onChange(s)}
            />
            <span>{s}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
