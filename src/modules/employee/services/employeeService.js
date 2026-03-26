import { LEAVE_STATUS, LEAVE_TYPES } from '@/utils/constants'

const employeeProfile = {
  id: 'EMP-2084',
  name: 'Olivia Rhye',
  role: 'Employee',
  department: 'Product Design',
  email: 'olivia.rhye@lms.local',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  avatar: 'OR',
  manager: 'Aarav Sharma',
}

const dashboardData = {
  alerts: [
    {
      id: 'dept-limit',
      variant: 'warning',
      title: 'Department Leave Limit Alert',
      message:
        'Your department has reached 80% of concurrent leave capacity (4 out of 5 trainers). New leave requests for March 10–15 may require additional approval.',
    },
    {
      id: 'wfh-restricted',
      variant: 'info',
      title: 'WFH Restricted During Active Semester',
      message:
        'WFH not allowed during active semester unless emergency. Emergency WFH requests require immediate supervisor approval.',
    },
  ],
  leaveTiles: [
    {
      id: 'sick',
      leaveType: 'Sick Leave',
      tone: 'success',
      availableDays: 8,
      usedDays: 1,
      totalDays: 9,
    },
    {
      id: 'casual',
      leaveType: 'Casual Leave',
      tone: 'warning',
      availableDays: 5,
      usedDays: 2,
      totalDays: 7,
    },
    {
      id: 'wfh',
      leaveType: 'WFH',
      tone: 'primary',
      // WFH is treated as infinite; we only show days used (no total/available wording).
      usedDays: 18,
    },
  ],
  upcomingLeaves: [
    {
      id: 'U-1001',
      leaveType: 'Casual Leave',
      status: LEAVE_STATUS.APPROVED,
      fromDate: '2026-03-10',
      toDate: '2026-03-12',
      days: 3,
    },
    {
      id: 'U-1002',
      leaveType: 'Sick Leave',
      status: LEAVE_STATUS.APPROVED,
      fromDate: '2026-02-28',
      toDate: '2026-03-01',
      days: 3,
    },
    {
      id: 'U-1003',
      leaveType: 'Work From Home',
      status: LEAVE_STATUS.APPROVED,
      fromDate: '2026-03-20',
      toDate: '2026-03-20',
      days: 1,
    },
  ],
  pendingRequests: [
    {
      id: 'P-1001',
      leaveType: 'Casual Leave',
      status: LEAVE_STATUS.PENDING,
      fromDate: '2026-03-24',
      toDate: '2026-03-24',
      days: 1,
    },
  ],
}

const leaveHistory = [
  {
    id: 'L-1001',
    leaveType: 'Annual Leave',
    fromDate: '2026-03-22',
    toDate: '2026-03-24',
    status: LEAVE_STATUS.PENDING,
  },
  {
    id: 'L-1002',
    leaveType: 'Sick Leave',
    fromDate: '2026-02-10',
    toDate: '2026-02-11',
    status: LEAVE_STATUS.APPROVED,
  },
  {
    id: 'L-1003',
    leaveType: 'Casual Leave',
    fromDate: '2026-01-16',
    toDate: '2026-01-16',
    status: LEAVE_STATUS.REJECTED,
  },
  {
    id: 'L-1004',
    leaveType: 'Work From Home',
    fromDate: '2025-12-18',
    toDate: '2025-12-19',
    status: LEAVE_STATUS.APPROVED,
  },
]

export const employeeService = {
  async getDashboard() {
    return Promise.resolve(dashboardData)
  },

  async getLeaves() {
    return Promise.resolve(leaveHistory)
  },

  async getProfile() {
    return Promise.resolve(employeeProfile)
  },

  async getLeaveTypes() {
    return Promise.resolve(LEAVE_TYPES)
  },

  async submitLeave(payload) {
    return Promise.resolve({
      success: true,
      message: `Leave request for ${payload.leaveType} submitted successfully.`,
    })
  },
}

export default employeeService
