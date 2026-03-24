import { LEAVE_STATUS, ROLE_HOME } from '@/utils/constants'

export function formatDate(value, options = {}) {
  if (!value) return '--'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(value))
}

export function getStatusColor(status) {
  const normalized = status?.toLowerCase()

  switch (normalized) {
    case LEAVE_STATUS.APPROVED:
      return 'bg-emerald-100 text-emerald-700'
    case LEAVE_STATUS.REJECTED:
      return 'bg-rose-100 text-rose-700'
    case LEAVE_STATUS.CANCELLED:
      return 'bg-slate-200 text-slate-700'
    default:
      return 'bg-amber-100 text-amber-700'
  }
}

export function truncate(value = '', maxLength = 32) {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength)}...`
}

export function getRoleHome(role) {
  return ROLE_HOME[role] || '/login'
}
