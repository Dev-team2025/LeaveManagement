import { Loader } from '@/components/common'
import UserTable from '@/modules/admin/components/UserTable'
import useAdminData from '@/modules/admin/hooks/useAdminData'

function UserManagement() {
  const { users, isLoading } = useAdminData()

  if (isLoading) {
    return <Loader label="Loading users" />
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Admin workspace</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink-900">User management</h1>
      </div>
      <UserTable users={users} />
    </section>
  )
}

export default UserManagement
