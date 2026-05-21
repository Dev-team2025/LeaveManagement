/**
 * Table — reusable table layout for lists across all modules
 * @param {{ columns: Array<{key:string, label:string, width?:string, render?:(val,row)=>ReactNode}>, rows: Array<object>, emptyMessage?: string }} props
 */
export default function Table({ columns, rows, emptyMessage = 'No records found.' }) {
  return (
    <div className="overflow-x-auto rounded-[20px] border border-ink-100 bg-white">
      <table className="min-w-full divide-y divide-ink-50 text-sm">
        <thead>
          <tr className="bg-ink-50">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={col.width ? { width: col.width } : undefined}
                className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-500"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-50">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-ink-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={row.id || i} className="transition-colors hover:bg-ink-25/60">
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4 text-ink-700">
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
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
