import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'

function LayoutWrapper() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-h-screen flex-1">
        <Navbar onToggleSidebar={() => setSidebarOpen((value) => !value)} />
        <main className="px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default LayoutWrapper
