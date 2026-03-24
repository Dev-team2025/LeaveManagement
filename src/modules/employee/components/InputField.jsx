function InputField({
  label,
  error,
  as = 'input',
  options = [],
  className = '',
  wrapperClassName = '',
  ...props
}) {
  const Component = as

  return (
    <label className={`flex flex-col gap-2 text-sm text-ink-700 ${wrapperClassName}`}>
      <span className="font-medium text-ink-900">{label}</span>
      <Component
        className={`rounded-2xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 ${error ? 'border-red-400 focus:ring-red-100' : ''} ${className}`}
        {...props}
      >
        {as === 'select'
          ? options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))
          : null}
      </Component>
      {error ? <span className="text-xs font-medium text-red-500">{error}</span> : null}
    </label>
  )
}

export default InputField
