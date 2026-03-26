import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Loader } from '@/components/common'
import useEmployeeProfile from '@/modules/employee/hooks/useEmployeeProfile'
import Sidebar from '@/modules/employee/components/Sidebar'

function LayoutWrapper() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const { profile, isLoading } = useEmployeeProfile()

  if (isLoading) {
    return <Loader fullScreen label="Loading employee workspace" />
  }

  return (
    <div className="min-h-screen bg-transparent lg:flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 px-4 py-4 lg:px-6">
        <main>
          <Outlet context={{ profile }} />
        </main>
      </div>
    </div>
  )
}

export default LayoutWrapper
