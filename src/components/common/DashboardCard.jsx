const TONES = {
  default: {
    ring: 'ring-ink-100',
    icon: 'bg-ink-50 text-ink-700',
  },
  primary: {
    ring: 'ring-brand-100',
    icon: 'bg-brand-50 text-brand-600',
  },
  success: {
    ring: 'ring-emerald-100',
    icon: 'bg-emerald-50 text-emerald-700',
  },
  warning: {
    ring: 'ring-amber-100',
    icon: 'bg-amber-50 text-amber-700',
  },
  danger: {
    ring: 'ring-rose-100',
    icon: 'bg-rose-50 text-rose-700',
  },
  info: {
    ring: 'ring-brand-100',
    icon: 'bg-brand-50 text-brand-600',
  },
}

function DashboardCard({ title, value, helper, icon, tone = 'default', badge }) {
  const style = TONES[tone] || TONES.default

  return (
    <article className={`rounded-[24px] bg-white p-5 shadow-panel ring-1 ${style.ring}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-ink-900">{value}</p>
          {helper ? <p className="mt-1 text-xs text-ink-500">{helper}</p> : null}
        </div>
        {icon ? (
          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${style.icon}`}>
            {icon}
          </div>
        ) : null}
      </div>
      {badge ? (
        <div className="mt-4">
          {badge}
        </div>
      ) : null}
    </article>
  )
}

export default DashboardCard
