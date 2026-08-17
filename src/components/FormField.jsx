/**
 * Campo de formulário reutilizável com label, input e mensagem de erro.
 */
export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required: isRequired,
  options,
}) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label htmlFor={inputId}>
        {label}
        {isRequired ? ' *' : ''}
      </label>
      {options ? (
        <select id={inputId} value={value} onChange={onChange} required={isRequired}>
          <option value="">Selecione...</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={isRequired}
        />
      )}
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}
