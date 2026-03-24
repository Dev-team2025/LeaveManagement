import { API_ENDPOINTS, LEAVE_STATUS } from '@/utils/constants'

const dashboardFallback = {
  cards: [
    { id: 'team-away', label: 'Team members away today', value: 4 },
    { id: 'pending', label: 'Pending approvals', value: 6 },
    { id: 'calendar', label: 'Upcoming overlaps', value: 2 },
  ],
}

const teamLeavesFallback = [
  { id: 'TM-301', employee: 'Neha Sharma', period: '21 Mar - 22 Mar', status: LEAVE_STATUS.PENDING },
  { id: 'TM-302', employee: 'Ajay Singh', period: '25 Mar - 27 Mar', status: LEAVE_STATUS.APPROVED },
]

export const managerService = {
  async getDashboard(axiosInstance) {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.MANAGER.DASHBOARD)
      return data
    } catch {
      return dashboardFallback
    }
  },
  async getTeamLeaves(axiosInstance) {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.MANAGER.TEAM_LEAVES)
      return data
    } catch {
      return teamLeavesFallback
    }
  },
}

export default managerService
