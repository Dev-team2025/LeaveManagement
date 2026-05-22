import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react'
import useAxios from '@/hooks/useAxios'
import { useAuth } from '@/hooks/useAuth'
import hrService from '@/modules/hr/services/hrService'
import employeeService from '@/modules/employee/services/employeeService'
import managerService from '@/modules/manager/services/managerService'
import {
  HOLIDAYS,
  LEAVE_POLICIES,
  getBalancesForEmployee,
  getLeaveRequestsByEmployee,
  getLeaveRequestsByManager,
  getNotificationsForUser,
} from '@/data/mockData'

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

export const AppDataContext = createContext(undefined)

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function AppDataProvider({ children }) {
  const axiosInstance = useAxios()
  const { isAuthenticated } = useAuth()
  const [employees, setEmployees] = useState([])
  const [leaveRequests, setLeaveRequests] = useState([])
  const [leaveBalances, setLeaveBalances] = useState([])
  const [leavePolicies, setLeavePolicies] = useState(LEAVE_POLICIES)
  const [holidays] = useState(HOLIDAYS)
  const [notifications, setNotifications] = useState([])
  const [isLoading, setLoading] = useState(true)

  const refreshData = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch all necessary data for the context based on roles
      const [hrRequests, empLeaves, allEmployees, managerLeaves, managerTeam] = await Promise.all([
        hrService.getLeaveRequests(axiosInstance).catch(() => []),
        employeeService.getLeaves(axiosInstance).catch(() => []),
        hrService.getEmployees(axiosInstance).catch(() => []),
        managerService.getTeamLeaves(axiosInstance).catch(() => []),
        managerService.getTeamMembers(axiosInstance).catch(() => []),
      ])


      const safeHrRequests = Array.isArray(hrRequests) ? hrRequests : []
      const safeEmpLeaves = Array.isArray(empLeaves) ? empLeaves : []
      const safeEmployees = Array.isArray(allEmployees) ? allEmployees : []

      // Set employees for selectors
      setEmployees(safeEmployees)

      // Combine and deduplicate requests
      // For HR role, hrRequests will have all requests. For others, empLeaves will have theirs.
      const allRequests = safeHrRequests.length > 0 ? safeHrRequests : safeEmpLeaves
      
      // Map backend fields to the frontend fields expected by the original UI
      const mappedRequests = allRequests.map((r) => ({

        id: r.id,
        employeeId: r.employeeId || r.userId,
        leaveType: r.type || r.leaveType,
        fromDate: r.fromDate,
        toDate: r.toDate,
        days: r.days,
        reason: r.reason,
        status: (r.status || 'pending').toLowerCase(),
        appliedOn: r.createdAt || r.appliedOn,
        reviewedOn: r.decidedAt || r.reviewedOn,
        reviewNote: r.note || r.reviewNote,
        attachmentUrl: r.attachmentUrl,
        attachmentName: r.attachmentName,
        isPaid: r.isPaid !== false,
        deductionAmount: r.deductionAmount || 0,
      }))

      setLeaveRequests(mappedRequests)
    } catch (err) {
      console.error('Failed to refresh AppData:', err)
    } finally {
      setLoading(false)
    }
  }, [axiosInstance])

  useEffect(() => {
    if (isAuthenticated) {
      refreshData()
    } else {
      setLeaveRequests([])
      setEmployees([])
    }
  }, [refreshData, isAuthenticated])

  // ── Actions ─────────────────────────────────────────────────────────────────

  const approveLeave = useCallback(async (requestId, reviewerNote = '') => {
    try {
      await hrService.approveLeaveRequest(axiosInstance, requestId, reviewerNote)
      await refreshData()
    } catch (err) {
      console.error('Failed to approve leave:', err)
    }
  }, [axiosInstance, refreshData])

  const rejectLeave = useCallback(async (requestId, reviewerNote = '') => {
    try {
      await hrService.rejectLeaveRequest(axiosInstance, requestId, reviewerNote)
      await refreshData()
    } catch (err) {
      console.error('Failed to reject leave:', err)
    }
  }, [axiosInstance, refreshData])

  const applyLeave = useCallback(async (employeeId, payload) => {
    try {
      const response = await employeeService.submitLeave(axiosInstance, payload)
      await refreshData()
      return response
    } catch (err) {
      console.error('Failed to apply leave:', err)
      throw err
    }
  }, [axiosInstance, refreshData])

  const markNotificationRead = useCallback((notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n)),
    )
  }, [])

  const markAllNotificationsRead = useCallback((employeeId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.recipientId === employeeId ? { ...n, isRead: true } : n)),
    )
  }, [])

  const updatePolicy = useCallback((policyId, updates) => {
    setLeavePolicies((prev) =>
      prev.map((p) => (p.id === policyId ? { ...p, ...updates } : p)),
    )
  }, [])

  const addEmployee = useCallback((employee) => {
    setEmployees((prev) => [employee, ...prev])
  }, [])

  const updateEmployee = useCallback(async (employeeId, updates) => {
    try {
      await hrService.updateEmployee(axiosInstance, employeeId, updates)
      await refreshData()
    } catch (err) {
      console.error('Failed to update employee:', err)
    }
  }, [axiosInstance, refreshData])

  // ── Selectors ────────────────────────────────────────────────────────────────

  const getEmployeeLeaves = useCallback(
    (employeeId) => getLeaveRequestsByEmployee(employeeId, leaveRequests),
    [leaveRequests],
  )

  const getManagerTeamLeaves = useCallback(
    (managerId) => getLeaveRequestsByManager(managerId, employees, leaveRequests),
    [employees, leaveRequests],
  )

  const getEmployeeBalances = useCallback(
    (employeeId) => getBalancesForEmployee(employeeId, leaveBalances),
    [leaveBalances],
  )

  const getUserNotifications = useCallback(
    (employeeId) => getNotificationsForUser(employeeId, notifications),
    [notifications],
  )

  const getPendingRequests = useCallback(
    () => leaveRequests.filter((lr) => lr.status === 'pending'),
    [leaveRequests],
  )

  const value = useMemo(
    () => ({
      // State
      employees,
      leaveRequests,
      leaveBalances,
      leavePolicies,
      holidays,
      notifications,
      // Actions
      approveLeave,
      rejectLeave,
      applyLeave,
      markNotificationRead,
      markAllNotificationsRead,
      updatePolicy,
      addEmployee,
      updateEmployee,
      // Selectors
      getEmployeeLeaves,
      getManagerTeamLeaves,
      getEmployeeBalances,
      getUserNotifications,
      getPendingRequests,
    }),
    [
      employees, leaveRequests, leaveBalances, leavePolicies, holidays, notifications,
      approveLeave, rejectLeave, applyLeave,
      markNotificationRead, markAllNotificationsRead,
      updatePolicy, addEmployee, updateEmployee,
      getEmployeeLeaves, getManagerTeamLeaves, getEmployeeBalances,
      getUserNotifications, getPendingRequests,
    ],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
