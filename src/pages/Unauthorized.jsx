import { Link } from 'react-router-dom'
import { Button } from '@/components/common'

function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-xl rounded-[28px] border border-white/70 bg-white/80 p-10 text-center shadow-panel">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-warning-500">
          Access denied
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-ink-900">
          You do not have permission to view this page
        </h1>
        <p className="mt-3 text-ink-500">
          Your account is signed in, but this route belongs to a different role workspace.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button variant="secondary">Go to my dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
