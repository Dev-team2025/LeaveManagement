function Loader({ fullScreen = false, label = 'Loading...' }) {
  const wrapperClass = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center py-10'

  return (
    <div className={wrapperClass}>
      <div className="flex flex-col items-center gap-3 text-ink-500">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  )
}

export default Loader
