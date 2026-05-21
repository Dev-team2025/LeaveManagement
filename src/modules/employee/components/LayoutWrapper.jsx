import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Loader } from '@/components/common'
import useEmployeeProfile from '@/modules/employee/hooks/useEmployeeProfile'
import Sidebar from '@/modules/employee/components/Sidebar'
import Navbar from '@/modules/employee/components/Navbar'

function LayoutWrapper() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const { profile, isLoading } = useEmployeeProfile()

  if (isLoading) {
    return <Loader fullScreen label="Loading employee workspace" />
  }

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-h-screen flex-1">
        <Navbar profile={profile} onToggleSidebar={() => setSidebarOpen((value) => !value)} />
        <main className="px-4 py-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet context={{ profile }} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default LayoutWrapper
