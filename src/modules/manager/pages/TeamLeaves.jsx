import { Loader } from '@/components/common'
import useManagerLeaves from '@/modules/manager/hooks/useManagerLeaves'
import TeamLeaveTable from '@/modules/manager/components/TeamLeaveTable'

function TeamLeaves() {
  const { teamLeaves, isLoading } = useManagerLeaves()

  if (isLoading) {
    return <Loader label="Loading team leave requests" />
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Manager workspace</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink-900">Team leave approvals</h1>
      </div>
      <TeamLeaveTable rows={teamLeaves} />
    </section>
  )
}

export default TeamLeaves
