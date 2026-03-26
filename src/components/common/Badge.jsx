// Badge — status pill component used across all modules
const BADGE_VARIANTS = {
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-100 text-slate-500 border-slate-200',
  national: 'bg-blue-50 text-blue-700 border-blue-200',
  festival: 'bg-purple-50 text-purple-700 border-purple-200',
}

const BADGE_DOTS = {
  pending: 'bg-amber-500',
  approved: 'bg-emerald-500',
  rejected: 'bg-red-500',
  cancelled: 'bg-slate-400',
}

/**
 * @param {{ status: string, showDot?: boolean, size?: 'sm'|'md', className?: string }} props
 */
export default function Badge({ status, showDot = true, size = 'sm', className = '' }) {
  const key = status?.toLowerCase()
  const variant = BADGE_VARIANTS[key] || 'bg-slate-100 text-slate-600 border-slate-200'
  const dot = BADGE_DOTS[key]

  const sizeClass = size === 'md'
    ? 'px-3 py-1.5 text-xs font-semibold'
    : 'px-2.5 py-1 text-xs font-medium'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variant} ${sizeClass} ${className}`}
    >
      {showDot && dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      )}
      <span className="capitalize">{status}</span>
    </span>
  )
}
