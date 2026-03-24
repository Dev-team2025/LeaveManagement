function Input({ label, error, id, className = '', ...props }) {
  const inputId = id || props.name

  return (
    <label htmlFor={inputId} className="flex w-full flex-col gap-2 text-sm text-ink-700">
      {label ? <span className="font-medium text-ink-900">{label}</span> : null}
      <input
        id={inputId}
        className={`h-11 rounded-2xl border border-ink-200 bg-white px-4 text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 ${error ? 'border-danger-500 focus:ring-red-100' : ''} ${className}`}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-danger-500">{error}</span> : null}
    </label>
  )
}

export default Input
