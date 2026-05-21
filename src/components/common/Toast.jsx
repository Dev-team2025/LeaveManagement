import { useEffect } from 'react'

const VARIANTS = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  error: 'bg-rose-50 text-rose-700 border-rose-200',
  info: 'bg-brand-50 text-brand-700 border-brand-200',
}

function Toast({ message, variant = 'success', onClose, duration = 3200 }) {
  useEffect(() => {
    if (!message) return undefined
    const timer = window.setTimeout(() => {
      onClose?.()
    }, duration)
    return () => window.clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message) return null

  return (
    <div className="fixed right-4 top-5 z-50 w-[min(92vw,360px)]" role="status" aria-live="polite">
      <div className={`rounded-2xl border px-4 py-3 text-sm font-medium shadow-panel ${VARIANTS[variant] || VARIANTS.info}`}>
        <div className="flex items-start justify-between gap-3">
          <span>{message}</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold text-ink-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toast
