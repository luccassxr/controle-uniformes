/**
 * Validações básicas de formulário (campos obrigatórios e regras simples).
 */

export function required(value, message = 'Campo obrigatório') {
  const v = typeof value === 'string' ? value.trim() : value
  if (!v) return message
  return null
}

export function email(value) {
  const err = required(value, 'Informe o e-mail')
  if (err) return err
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return 'E-mail inválido'
  }
  return null
}

export function matchFields(a, b, message = 'Os campos não coincidem') {
  if (a !== b) return message
  return null
}

export function minLength(value, len, message) {
  if (!value || value.length < len) return message
  return null
}

/** Monta objeto de erros a partir de regras { campo: fn(value) } */
export function validateForm(values, rules) {
  const errors = {}
  for (const [key, rule] of Object.entries(rules)) {
    const msg = rule(values[key], values)
    if (msg) errors[key] = msg
  }
  return errors
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}
