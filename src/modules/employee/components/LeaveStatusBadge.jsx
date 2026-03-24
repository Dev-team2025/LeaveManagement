import { getStatusColor } from '@/utils/helpers'

function LeaveStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex min-w-24 justify-center rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusColor(status)}`}
    >
      {status}
    </span>
  )
}

export default LeaveStatusBadge
