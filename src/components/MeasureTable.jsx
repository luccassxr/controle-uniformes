/**
 * Tabela de referência de medidas (dados fictícios do protótipo).
 */
import './MeasureTable.css'

export default function MeasureTable({ headers, rows }) {
  return (
    <div className="measure-table-wrap">
      <table className="measure-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
