import { useEffect } from 'react'

function Modal({ isOpen, title, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return undefined

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/45 px-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="font-display text-xl font-semibold text-ink-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-ink-100 px-3 py-1 text-sm font-medium text-ink-700 transition hover:bg-ink-200"
          >
            Close
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

export default Modal
