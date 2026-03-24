const toneClasses = {
  primary: 'bg-brand-600 text-white',
  neutral: 'bg-white text-ink-900 border border-ink-100',
  success: 'bg-emerald-500 text-white',
}

function LeaveCard({ label, value, helper, tone = 'neutral' }) {
  return (
    <article className={`rounded-[28px] p-5 shadow-panel ${toneClasses[tone]}`}>
      <p className={`text-sm ${tone === 'neutral' ? 'text-ink-500' : 'text-white/75'}`}>{label}</p>
      <div className="mt-6 flex items-end justify-between gap-4">
        <p className="font-display text-4xl font-semibold">{value}</p>
        <span className={`text-xs font-medium ${tone === 'neutral' ? 'text-ink-400' : 'text-white/70'}`}>
          {helper}
        </span>
      </div>
    </article>
  )
}

export default LeaveCard
