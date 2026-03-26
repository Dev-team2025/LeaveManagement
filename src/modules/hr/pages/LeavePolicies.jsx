import { useState } from 'react'
import { useAppData } from '@/context/AppDataContext'
import { Modal } from '@/components/common'

const TYPE_COLORS = {
  '#2563EB': 'bg-blue-100 text-blue-700',
  '#DC2626': 'bg-red-100 text-red-700',
  '#D97706': 'bg-amber-100 text-amber-700',
  '#7C3AED': 'bg-purple-100 text-purple-700',
  '#DB2777': 'bg-pink-100 text-pink-700',
  '#059669': 'bg-emerald-100 text-emerald-700',
}

function PolicyCard({ policy, onEdit }) {
  const colorClass = TYPE_COLORS[policy.color] || 'bg-slate-100 text-slate-600'
  const used = Math.round((policy.totalDays * 0.5)) // demo usage bar
  const pct = Math.min(100, Math.round((used / policy.totalDays) * 100))
  return (
    <article className="rounded-[20px] border border-[#E5E7EB] bg-white p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}>
            {policy.code}
          </span>
          <h3 className="mt-2 font-semibold text-[#0F172A]">{policy.leaveType}</h3>
          <p className="mt-1 text-xs text-[#64748B] leading-relaxed">{policy.description}</p>
        </div>
        <button
          onClick={() => onEdit(policy)}
          className="shrink-0 rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-xs font-semibold text-[#64748B] hover:bg-[#F8F9FC] transition"
        >
          Edit
        </button>
      </div>
      <div>
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-[#64748B]">Allocation</span>
          <span className="font-semibold text-[#0F172A]">{policy.totalDays} days / year</span>
        </div>
        <div className="h-2 w-full rounded-full bg-[#F1F5F9]">
          <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: policy.color }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-[#F8F9FC] p-2.5">
          <p className="text-[#94A3B8]">Carry Forward</p>
          <p className="mt-0.5 font-semibold text-[#334155]">
            {policy.carryForward ? `Max ${policy.maxCarryForward}d` : 'No'}
          </p>
        </div>
        <div className="rounded-lg bg-[#F8F9FC] p-2.5">
          <p className="text-[#94A3B8]">Encashable</p>
          <p className="mt-0.5 font-semibold text-[#334155]">{policy.encashable ? 'Yes' : 'No'}</p>
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-xs text-[#94A3B8]">Applicable to</p>
        <div className="flex flex-wrap gap-1.5">
          {policy.applicableTo.map((role) => (
            <span key={role} className="rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-xs font-medium capitalize text-[#334155]">
              {role}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function LeavePolicies() {
  const { leavePolicies, updatePolicy } = useAppData()
  const [editModal, setEditModal] = useState(null)
  const [editForm, setEditForm] = useState({})

  function openEdit(policy) {
    setEditForm({ totalDays: policy.totalDays, carryForward: policy.carryForward, maxCarryForward: policy.maxCarryForward, encashable: policy.encashable })
    setEditModal(policy)
  }

  function saveEdit() {
    updatePolicy(editModal.id, {
      totalDays: Number(editForm.totalDays),
      carryForward: editForm.carryForward,
      maxCarryForward: Number(editForm.maxCarryForward),
      encashable: editForm.encashable,
    })
    setEditModal(null)
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1D4ED8]">HR Workspace</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#0F172A]">Leave Policies</h1>
        <p className="mt-0.5 text-sm text-[#64748B]">Manage leave entitlements and policies for all employee roles</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {leavePolicies.map((p) => (
          <PolicyCard key={p.id} policy={p} onEdit={openEdit} />
        ))}
      </div>

      <Modal isOpen={Boolean(editModal)} onClose={() => setEditModal(null)} title={`Edit — ${editModal?.leaveType}`}>
        {editModal && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#334155]">Total Days / Year</label>
              <input
                type="number"
                min={1}
                max={365}
                value={editForm.totalDays}
                onChange={(e) => setEditForm((f) => ({ ...f, totalDays: e.target.value }))}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-[#334155] outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/10"
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-3">
              <span className="text-sm font-medium text-[#334155]">Carry Forward</span>
              <button
                onClick={() => setEditForm((f) => ({ ...f, carryForward: !f.carryForward }))}
                className={`relative h-6 w-11 rounded-full transition ${editForm.carryForward ? 'bg-[#1D4ED8]' : 'bg-[#E5E7EB]'}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${editForm.carryForward ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
            {editForm.carryForward && (
              <div>
                <label className="mb-1 block text-sm font-medium text-[#334155]">Max Carry Forward Days</label>
                <input
                  type="number"
                  min={0}
                  value={editForm.maxCarryForward}
                  onChange={(e) => setEditForm((f) => ({ ...f, maxCarryForward: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-[#334155] outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/10"
                />
              </div>
            )}
            <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-3">
              <span className="text-sm font-medium text-[#334155]">Encashable</span>
              <button
                onClick={() => setEditForm((f) => ({ ...f, encashable: !f.encashable }))}
                className={`relative h-6 w-11 rounded-full transition ${editForm.encashable ? 'bg-[#1D4ED8]' : 'bg-[#E5E7EB]'}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${editForm.encashable ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={saveEdit} className="flex-1 rounded-xl bg-[#1D4ED8] py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF] transition">
                Save Changes
              </button>
              <button onClick={() => setEditModal(null)} className="flex-1 rounded-xl border border-[#E5E7EB] py-2.5 text-sm font-semibold text-[#64748B] hover:bg-[#F8F9FC]">
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
