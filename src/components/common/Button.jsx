const variantClasses = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-600',
  secondary: 'bg-white text-ink-900 ring-1 ring-ink-200 hover:bg-ink-50 focus-visible:outline-brand-600',
  danger: 'bg-danger-500 text-white hover:bg-red-700 focus-visible:outline-danger-500',
  ghost: 'bg-transparent text-ink-700 hover:bg-white/70 focus-visible:outline-brand-600',
}

const sizeClasses = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
}

function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
