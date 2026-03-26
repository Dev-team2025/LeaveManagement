/**
 * Table — reusable table layout for lists across all modules
 * @param {{ columns: Array<{key:string, label:string, width?:string, render?:(val,row)=>ReactNode}>, rows: Array<object>, emptyMessage?: string }} props
 */
export default function Table({ columns, rows, emptyMessage = 'No records found.' }) {
  return (
    <div className="overflow-x-auto rounded-[16px] border border-[#E5E7EB] bg-white">
      <table className="min-w-full divide-y divide-[#F1F5F9] text-sm">
        <thead>
          <tr className="bg-[#F8F9FC]">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={col.width ? { width: col.width } : undefined}
                className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F1F5F9]">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-[#94A3B8]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={row.id || i} className="transition-colors hover:bg-[#F8F9FC]">
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4 text-[#334155]">
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
