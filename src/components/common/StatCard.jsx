/**
 * StatCard — reusable metric card used on dashboards across all modules
 * @param {{ label: string, value: string|number, sub?: string, icon?: React.ReactNode, accentColor?: string }} props
 */
export default function StatCard({ label, value, sub, icon, accentColor = '#1D4ED8' }) {
  return (
    <article className="rounded-[24px] border border-ink-100 bg-white p-5 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-ink-500 truncate">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-ink-900">{value}</p>
          {sub && <p className="mt-1 text-xs text-ink-500">{sub}</p>}
        </div>
        {icon && (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${accentColor}14` }}
          >
            <span style={{ color: accentColor }}>{icon}</span>
          </div>
        )}
      </div>
    </article>
  )
}
