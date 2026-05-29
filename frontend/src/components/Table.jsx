import React from 'react'
import './Table.css'

export default function Table({ columns, data, loading, showNo = true }) {
  if (loading) return <div className="table-loading">Memuat data...</div>

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {showNo && <th style={{ width: '52px' }}>No</th>}
            {columns.map(col => (
              <th key={col.key} style={{ width: col.width }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (showNo ? 1 : 0)} className="table-empty">
                Tidak ada data
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i}>
                {showNo && <td className="td-no">{i + 1}</td>}
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
