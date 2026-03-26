import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  EMPLOYEES,
  HOLIDAYS,
  LEAVE_BALANCES,
  LEAVE_POLICIES,
  LEAVE_REQUESTS,
  NOTIFICATIONS,
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
  const [employees, setEmployees] = useState(EMPLOYEES)
  const [leaveRequests, setLeaveRequests] = useState(LEAVE_REQUESTS)
  const [leaveBalances, setLeaveBalances] = useState(LEAVE_BALANCES)
  const [leavePolicies, setLeavePolicies] = useState(LEAVE_POLICIES)
  const [holidays] = useState(HOLIDAYS)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)

  // ── Actions ─────────────────────────────────────────────────────────────────

  const approveLeave = useCallback((requestId, reviewerNote = '') => {
    setLeaveRequests((prev) =>
      prev.map((lr) =>
        lr.id === requestId
          ? { ...lr, status: 'approved', reviewedOn: new Date().toISOString().split('T')[0], reviewNote: reviewerNote }
          : lr,
      ),
    )
    // Update balance: move pending days → used days
    setLeaveBalances((prev) => {
      const req = leaveRequests.find((lr) => lr.id === requestId)
      if (!req) return prev
      return prev.map((bal) => {
        if (bal.employeeId === req.employeeId && bal.leaveType === req.leaveType) {
          return {
            ...bal,
            usedDays: bal.usedDays + req.days,
            pendingDays: Math.max(0, bal.pendingDays - req.days),
          }
        }
        return bal
      })
    })
  }, [leaveRequests])

  const rejectLeave = useCallback((requestId, reviewerNote = '') => {
    setLeaveRequests((prev) =>
      prev.map((lr) =>
        lr.id === requestId
          ? { ...lr, status: 'rejected', reviewedOn: new Date().toISOString().split('T')[0], reviewNote: reviewerNote }
          : lr,
      ),
    )
    // Restore pending days in balance
    setLeaveBalances((prev) => {
      const req = leaveRequests.find((lr) => lr.id === requestId)
      if (!req) return prev
      return prev.map((bal) => {
        if (bal.employeeId === req.employeeId && bal.leaveType === req.leaveType) {
          return { ...bal, pendingDays: Math.max(0, bal.pendingDays - req.days) }
        }
        return bal
      })
    })
  }, [leaveRequests])

  const applyLeave = useCallback((employeeId, payload) => {
    const id = `LR${String(Date.now()).slice(-6)}`
    const newRequest = {
      id,
      employeeId,
      policyId: leavePolicies.find((p) => p.leaveType === payload.leaveType)?.id || '',
      leaveType: payload.leaveType,
      fromDate: payload.fromDate,
      toDate: payload.toDate,
      days: payload.days,
      reason: payload.reason,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
      reviewedBy: null,
      reviewedOn: null,
      reviewNote: '',
    }
    setLeaveRequests((prev) => [newRequest, ...prev])
    // Add pending days to balance
    setLeaveBalances((prev) =>
      prev.map((bal) => {
        if (bal.employeeId === employeeId && bal.leaveType === payload.leaveType) {
          return { ...bal, pendingDays: bal.pendingDays + payload.days }
        }
        return bal
      }),
    )
    return newRequest
  }, [leavePolicies])

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

  const updateEmployee = useCallback((employeeId, updates) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? { ...e, ...updates } : e)),
    )
  }, [])

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
