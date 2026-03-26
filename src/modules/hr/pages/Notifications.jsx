import { useAppData } from '@/context/AppDataContext'
import useAuth from '@/hooks/useAuth'

const NOTIF_ICONS = {
  leave_approved: { icon: '✅', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  leave_rejected: { icon: '❌', bg: 'bg-red-50', text: 'text-red-700' },
  leave_pending:  { icon: '⏳', bg: 'bg-amber-50',  text: 'text-amber-700'  },
  leave_applied:  { icon: '📋', bg: 'bg-blue-50',   text: 'text-blue-700'   },
  policy_reminder:{ icon: '📢', bg: 'bg-purple-50', text: 'text-purple-700' },
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppData()
  const { user } = useAuth()
  const myId = user?.id || 'EMP004'

  const myNotifications = notifications
    .filter((n) => n.recipientId === myId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const unreadCount = myNotifications.filter((n) => !n.isRead).length

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1D4ED8]">HR Workspace</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#0F172A]">Notifications</h1>
          <p className="mt-0.5 text-sm text-[#64748B]">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All notifications read'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllNotificationsRead(myId)}
            className="shrink-0 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#64748B] hover:bg-[#F8F9FC] transition"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {myNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[20px] border border-[#E5E7EB] bg-white px-6 py-16 text-center">
            <span className="text-4xl">🔔</span>
            <p className="mt-4 font-semibold text-[#0F172A]">No notifications</p>
            <p className="mt-1 text-sm text-[#94A3B8]">You're all caught up!</p>
          </div>
        ) : (
          myNotifications.map((notif) => {
            const style = NOTIF_ICONS[notif.type] || NOTIF_ICONS.leave_applied
            return (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`flex cursor-pointer items-start gap-4 rounded-[16px] border p-4 transition hover:bg-[#FAFAFA] ${
                  notif.isRead
                    ? 'border-[#E5E7EB] bg-white'
                    : 'border-[#DBEAFE] bg-[#EFF6FF]'
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${style.bg}`}>
                  {style.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className={`text-sm font-semibold ${notif.isRead ? 'text-[#334155]' : 'text-[#0F172A]'}`}>
                      {notif.title}
                    </p>
                    <span className="shrink-0 text-xs text-[#94A3B8]">{timeAgo(notif.createdAt)}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-[#64748B]">{notif.message}</p>
                </div>
                {!notif.isRead && (
                  <span className="mt-1.5 flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#1D4ED8]" />
                )}
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
