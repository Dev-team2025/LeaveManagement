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
      <button
        type="button"
        onClick={() => setSidebarOpen((value) => !value)}
        className="fixed left-4 top-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-panel lg:hidden"
        aria-label="Toggle sidebar"
      >
        <span className="block h-0.5 w-5 bg-current" />
        <span className="mt-1 block h-0.5 w-5 bg-current" />
        <span className="mt-1 block h-0.5 w-5 bg-current" />
      </button>
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
