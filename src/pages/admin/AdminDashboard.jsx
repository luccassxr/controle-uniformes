/**
 * Dashboard do administrador — users + uniformes (Firestore).
 */
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import AlertMessage from '../../components/AlertMessage'
import { useAuth } from '../../context/AuthContext'
import { logoutUser } from '../../services/authService'
import {
  getAllStudentsWithUniformes,
  countSizesByPiece,
} from '../../services/firestoreService'
import { TURNOS, SERIES } from '../../data/mockData'
import { exportStudentsCsv } from '../../utils/exportCsv'
import './AdminDashboard.css'

const SIZE_FIELDS = [
  { key: 'camiseta', label: 'Camiseta' },
  { key: 'jaqueta', label: 'Jaqueta' },
  { key: 'calca', label: 'Calça' },
  { key: 'bermuda', label: 'Bermuda' },
  { key: 'shortSaia', label: 'Short saia' },
  { key: 'tenis', label: 'Tênis' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [search, setSearch] = useState('')
  const [filterTurno, setFilterTurno] = useState('')
  const [filterSerie, setFilterSerie] = useState('')

  useEffect(() => {
    loadStudents()
  }, [])

  async function loadStudents() {
    setLoading(true)
    try {
      const data = await getAllStudentsWithUniformes()
      setStudents(data)
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Erro ao carregar alunos. Verifique as regras do Firestore.',
      })
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return students.filter((s) => {
      const matchSearch =
        !q ||
        (s.nome || '').toLowerCase().includes(q) ||
        (s.matricula || '').toLowerCase().includes(q)
      const matchTurno = !filterTurno || s.turno === filterTurno
      const matchSerie = !filterSerie || s.serie === filterSerie
      return matchSearch && matchTurno && matchSerie
    })
  }, [students, search, filterTurno, filterSerie])

  const sizeCounts = useMemo(
    () =>
      SIZE_FIELDS.map(({ key, label }) => ({
        label,
        counts: countSizesByPiece(filtered, key),
      })),
    [filtered]
  )

  const handleLogout = async () => {
    await logoutUser()
    navigate('/')
  }

  const handleExport = () => {
    if (filtered.length === 0) {
      setFeedback({ type: 'error', message: 'Nenhum aluno para exportar.' })
      return
    }
    exportStudentsCsv(filtered)
    setFeedback({ type: 'success', message: 'CSV exportado com sucesso!' })
  }

  return (
    <PageLayout wide showLogo>
      <h2 className="card__title">Painel de controle</h2>
      <p className="card__subtitle">Administrador: {user?.email}</p>
      <AlertMessage type={feedback.type} message={feedback.message} />

      <div className="admin-toolbar">
        <input
          className="admin-search"
          placeholder="Buscar por nome ou matrícula..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="admin-filter"
          value={filterTurno}
          onChange={(e) => setFilterTurno(e.target.value)}
        >
          <option value="">Todos os turnos</option>
          {TURNOS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className="admin-filter"
          value={filterSerie}
          onChange={(e) => setFilterSerie(e.target.value)}
        >
          <option value="">Todas as séries</option>
          {SERIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn--sm" onClick={handleExport}>
          Exportar CSV
        </button>
        <button type="button" className="btn btn--sm btn--outline" onClick={loadStudents}>
          Atualizar
        </button>
      </div>

      <p className="admin-stats">
        <strong>{filtered.length}</strong> aluno(s) exibido(s) de {students.length} total
      </p>

      <section className="admin-counts">
        <h3 className="admin-counts__title">Contagem por tamanho</h3>
        <div className="admin-counts__grid">
          {sizeCounts.map(({ label, counts }) => (
            <div key={label} className="admin-count-card">
              <h4>{label}</h4>
              {Object.keys(counts).length === 0 ? (
                <p className="admin-count-empty">—</p>
              ) : (
                <ul>
                  {Object.entries(counts)
                    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
                    .map(([size, qty]) => (
                      <li key={size}>
                        <span>{size}</span>
                        <strong>{qty}</strong>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {loading ? (
        <p className="card__subtitle">Carregando alunos...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Matrícula</th>
                <th>Turno</th>
                <th>Série</th>
                <th>Email</th>
                <th>Camiseta</th>
                <th>Jaqueta</th>
                <th>Calça</th>
                <th>Bermuda</th>
                <th>Short saia</th>
                <th>Tênis</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="admin-table__empty">
                    Nenhum aluno encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.uid}>
                    <td>{s.nome || '—'}</td>
                    <td>{s.matricula || '—'}</td>
                    <td>{s.turno || '—'}</td>
                    <td>{s.serie || '—'}</td>
                    <td>{s.email || '—'}</td>
                    <td>{s.camiseta || '—'}</td>
                    <td>{s.jaqueta || '—'}</td>
                    <td>{s.calca || '—'}</td>
                    <td>{s.bermuda || '—'}</td>
                    <td>{s.shortSaia || '—'}</td>
                    <td>{s.tenis || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <button type="button" className="btn btn--outline" onClick={handleLogout}>
        Sair
      </button>
    </PageLayout>
  )
}
