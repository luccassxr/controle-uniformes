/**
 * Seleção exclusiva do tamanho do tênis (numeração 34–45).
 */
import { TENIS_TABELA } from '../data/mockData'
import './ShoeSizeSelect.css'

export default function ShoeSizeSelect({ value, onChange, label = 'Tamanho do tênis' }) {
  return (
    <div className="field">
      <label htmlFor="tenis-size">{label} *</label>
      <select
        id="tenis-size"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="">Selecione o tamanho...</option>
        {TENIS_TABELA.map((t) => (
          <option key={t.num} value={String(t.num)}>
            {t.num} — {t.cm} cm
          </option>
        ))}
      </select>
    </div>
  )
}
