/**
 * Exporta alunos (users + uniformes) para CSV.
 */
export function exportStudentsCsv(students) {
  const headers = [
    'Nome completo',
    'Matrícula',
    'Turno',
    'Série',
    'Email',
    'Camiseta',
    'Jaqueta',
    'Calça',
    'Bermuda',
    'Short saia',
    'Tênis',
  ]

  const rows = students.map((s) => [
    s.nome || '',
    s.matricula || '',
    s.turno || '',
    s.serie || '',
    s.email || '',
    s.camiseta || '',
    s.jaqueta || '',
    s.calca || '',
    s.bermuda || '',
    s.shortSaia || '',
    s.tenis || '',
  ])

  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`
  const csv = [headers, ...rows].map((r) => r.map(escape).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `unicontrol-alunos-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
