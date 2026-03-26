import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Loader } from '@/components/common'
import { LayoutWrapper } from '@/components/layout'
import EmployeeLayoutWrapper from '@/modules/employee/components/LayoutWrapper'
import useAuth from '@/hooks/useAuth'
import ProtectedRoute from '@/routes/ProtectedRoute'
import { ROLES } from '@/utils/constants'
import { getRoleHome } from '@/utils/helpers'

// ── Global ────────────────────────────────────────────────────────────────────
const Login        = lazy(() => import('@/pages/Login'))
const NotFound     = lazy(() => import('@/pages/NotFound'))
const Unauthorized = lazy(() => import('@/pages/Unauthorized'))

// ── Employee ──────────────────────────────────────────────────────────────────
const EmployeeDashboard = lazy(() => import('@/modules/employee/pages/EmployeeDashboard'))
const MyLeaves          = lazy(() => import('@/modules/employee/pages/MyLeaves'))
const ApplyLeave        = lazy(() => import('@/modules/employee/pages/ApplyLeave'))
const Profile           = lazy(() => import('@/modules/employee/pages/Profile'))

// ── HR ────────────────────────────────────────────────────────────────────────
const HRDashboard     = lazy(() => import('@/modules/hr/pages/HRDashboard'))
const LeaveRequests   = lazy(() => import('@/modules/hr/pages/LeaveRequests'))
const EmployeeList    = lazy(() => import('@/modules/hr/pages/EmployeeList'))
const LeavePolicies   = lazy(() => import('@/modules/hr/pages/LeavePolicies'))
const HolidayCalendar = lazy(() => import('@/modules/hr/pages/HolidayCalendar'))
const Reports         = lazy(() => import('@/modules/hr/pages/Reports'))
const HRNotifications = lazy(() => import('@/modules/hr/pages/Notifications'))
const HRProfile       = lazy(() => import('@/modules/hr/pages/HRProfile'))

// ── Manager ───────────────────────────────────────────────────────────────────
const ManagerDashboard = lazy(() => import('@/modules/manager/pages/ManagerDashboard'))
const TeamLeaves       = lazy(() => import('@/modules/manager/pages/TeamLeaves'))

// ── Admin ─────────────────────────────────────────────────────────────────────
const AdminDashboard  = lazy(() => import('@/modules/admin/pages/AdminDashboard'))
const UserManagement  = lazy(() => import('@/modules/admin/pages/UserManagement'))
const LeaveTypes      = lazy(() => import('@/modules/admin/pages/LeaveTypes'))

function RootRedirect() {
  const { isAuthenticated, role } = useAuth()
  return <Navigate to={isAuthenticated ? getRoleHome(role) : '/login'} replace />
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader fullScreen />}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ── Employee ──────────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]} />}>
            <Route element={<EmployeeLayoutWrapper />}>
              <Route path="/employee/dashboard"   element={<EmployeeDashboard />} />
              <Route path="/employee/my-leaves"   element={<MyLeaves />} />
              <Route path="/employee/apply-leave" element={<ApplyLeave />} />
              <Route path="/employee/profile"     element={<Profile />} />
            </Route>
          </Route>

          {/* ── HR ────────────────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.HR]} />}>
            <Route element={<LayoutWrapper />}>
              <Route path="/hr/dashboard"      element={<HRDashboard />} />
              <Route path="/hr/leave-requests" element={<LeaveRequests />} />
              <Route path="/hr/employees"      element={<EmployeeList />} />
              <Route path="/hr/leave-policies" element={<LeavePolicies />} />
              <Route path="/hr/holidays"       element={<HolidayCalendar />} />
              <Route path="/hr/reports"        element={<Reports />} />
              <Route path="/hr/notifications"  element={<HRNotifications />} />
              <Route path="/hr/profile"        element={<HRProfile />} />
            </Route>
          </Route>

          {/* ── Manager ───────────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER]} />}>
            <Route element={<LayoutWrapper />}>
              <Route path="/manager/dashboard"   element={<ManagerDashboard />} />
              <Route path="/manager/team-leaves" element={<TeamLeaves />} />
            </Route>
          </Route>

          {/* ── Admin ─────────────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route element={<LayoutWrapper />}>
              <Route path="/admin/dashboard"   element={<AdminDashboard />} />
              <Route path="/admin/users"       element={<UserManagement />} />
              <Route path="/admin/leave-types" element={<LeaveTypes />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default AppRoutes
