import { Link } from 'react-router-dom'
import { Button } from '@/components/common'

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">404</p>
        <h1 className="mt-4 font-display text-5xl font-semibold text-ink-900">Page not found</h1>
        <p className="mt-4 text-lg text-ink-500">
          The page you requested does not exist or may have moved.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button>Back to home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
