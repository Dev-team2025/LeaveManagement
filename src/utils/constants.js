export const ROLES = {
  EMPLOYEE: 'employee',
  HR: 'hr',
  MANAGER: 'manager',
  ADMIN: 'admin',
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  EMPLOYEE: {
    DASHBOARD: '/employee/dashboard',
    LEAVES: '/employee/leaves',
    APPLY: '/employee/leaves',
  },
  HR: {
    DASHBOARD: '/hr/dashboard',
    REQUESTS: '/hr/requests',
    EMPLOYEES: '/hr/employees',
  },
  MANAGER: {
    DASHBOARD: '/manager/dashboard',
    TEAM_LEAVES: '/manager/team-leaves',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    LEAVE_TYPES: '/admin/leave-types',
  },
}

export const LEAVE_TYPES = ['Annual', 'Sick', 'Casual', 'Work From Home', 'Maternity']

export const LEAVE_STATUS = {
  APPROVED: 'approved',
  PENDING: 'pending',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
}

export const ROLE_LABELS = {
  [ROLES.EMPLOYEE]: 'Employee',
  [ROLES.HR]: 'HR',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.ADMIN]: 'Admin',
}

export const ROLE_HOME = {
  [ROLES.EMPLOYEE]: '/employee/dashboard',
  [ROLES.HR]: '/hr/dashboard',
  [ROLES.MANAGER]: '/manager/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
}

export const SIDEBAR_LINKS = {
  [ROLES.EMPLOYEE]: [
    { label: 'Dashboard', to: '/employee/dashboard' },
    { label: 'My Leaves', to: '/employee/my-leaves' },
    { label: 'Apply Leave', to: '/employee/apply-leave' },
    { label: 'Profile', to: '/employee/profile' },
  ],
  [ROLES.HR]: [
    { label: 'Dashboard', to: '/hr/dashboard' },
    { label: 'Leave Requests', to: '/hr/leave-requests' },
    { label: 'Leave Policies', to: '/hr/leave-policies' },
    { label: 'Employees', to: '/hr/employees' },
    { label: 'Holiday Calendar', to: '/hr/holidays' },
    { label: 'Reports', to: '/hr/reports' },
    { label: 'Notifications', to: '/hr/notifications' },
    { label: 'Profile', to: '/hr/profile' },
  ],
  [ROLES.MANAGER]: [
    { label: 'Dashboard', to: '/manager/dashboard' },
    { label: 'Team Leaves', to: '/manager/team-leaves' },
  ],
  [ROLES.ADMIN]: [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Users', to: '/admin/users' },
    { label: 'Leave Types', to: '/admin/leave-types' },
  ],
}
