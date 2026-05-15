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

export function openAttachment(url, fileName = 'attachment') {
  if (!url) return

  // If it's a data URL, we need to handle it carefully to avoid browser blocks
  if (url.startsWith('data:')) {
    try {
      const parts = url.split(',')
      const mime = parts[0].match(/:(.*?);/)[1]
      const b64Data = parts[1]
      
      const byteCharacters = atob(b64Data)
      const byteArrays = []
      
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512)
        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }
      
      const blob = new Blob(byteArrays, { type: mime })
      const blobUrl = URL.createObjectURL(blob)
      
      // Open in new tab
      const win = window.open(blobUrl, '_blank')
      if (win) {
        win.focus()
      } else {
        // If popup blocked, fallback to download
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = fileName
        link.click()
      }
    } catch (err) {
      console.error('Error opening attachment:', err)
      // Final fallback
      window.open(url, '_blank')
    }
  } else {
    // Normal URL
    window.open(url, '_blank')
  }
}
