import { Button } from '@/components/common'

function UserTable({ users }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-panel">
      <table className="min-w-full divide-y divide-ink-100">
        <thead className="bg-ink-50">
          <tr>
            {['Name', 'Email', 'Role', 'Action'].map((heading) => (
              <th key={heading} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 text-sm text-ink-700">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-5 py-4 font-medium text-ink-900">{user.name}</td>
              <td className="px-5 py-4">{user.email}</td>
              <td className="px-5 py-4 capitalize">{user.role}</td>
              <td className="px-5 py-4">
                <Button size="sm" variant="secondary">
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable
