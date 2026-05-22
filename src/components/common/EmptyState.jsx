function EmptyState({ title, message, actionLabel, onAction, icon, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-[28px] border border-ink-100 bg-white px-6 py-12 text-center shadow-panel ${className}`}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        {icon || (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-ink-500">{message}</p>
      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-2xl bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

export default EmptyState
