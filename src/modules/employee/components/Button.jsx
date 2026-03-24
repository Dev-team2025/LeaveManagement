function Button({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) {
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700',
    secondary: 'bg-white text-ink-900 ring-1 ring-ink-200 hover:bg-ink-50',
    ghost: 'bg-transparent text-ink-500 hover:bg-ink-100',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
