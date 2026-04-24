import { useAppData } from '@/context/AppDataContext'
import useAuth from '@/hooks/useAuth'

export default function ManagerNotifications() {
  const { notifications } = useAppData()
  const { user } = useAuth()
  
  const userNotifications = notifications.filter(n => n.recipientId === user.id)

  return (
    <section className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="space-y-1">
        <h1 className="font-display text-4xl font-black text-ink-900 tracking-tight">Notifications</h1>
        <p className="text-sm font-bold text-ink-400">Stay updated on team activities and system alerts.</p>
      </div>

      <div className="space-y-4">
        {userNotifications.length === 0 ? (
          <div className="rounded-[32px] border-2 border-dashed border-ink-100 bg-white p-20 text-center">
            <p className="text-sm font-bold text-ink-400 font-display uppercase tracking-widest">Inbox is empty</p>
          </div>
        ) : (
          userNotifications.map((notif) => (
            <div key={notif.id} className={`rounded-[24px] border ${notif.isRead ? 'border-ink-50 bg-ink-25/50' : 'border-brand-100 bg-brand-50/30'} p-6 transition hover:shadow-lg`}>
              <p className="font-black text-ink-900">{notif.title}</p>
              <p className="mt-1 text-sm font-medium text-ink-600">{notif.message}</p>
              <p className="mt-4 text-[10px] font-black text-ink-300 uppercase tracking-widest">{new Date(notif.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
