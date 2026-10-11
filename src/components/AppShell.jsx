import { useLocation, Outlet } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const routeNames = {
  '/dashboard': ['Dashboard'],
  '/students': ['Dashboard', 'Students'],
  '/students/:id': ['Dashboard', 'Students', 'Student Details'],
  '/courses': ['Dashboard', 'Courses'],
  '/courses/:id': ['Dashboard', 'Courses', 'Course Details'],
  '/attendance': ['Dashboard', 'Attendance'],
  '/reports': ['Dashboard', 'Academic Reports'],
  '/settings': ['Dashboard', 'Settings'],
}

export default function AppShell({ students, courses, globalSearch, onGlobalSearchChange }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const breadcrumbs = useMemo(() => {
    const pathname = location.pathname
    const match = Object.keys(routeNames).find((route) => {
      if (!route.includes(':')) return route === pathname
      const pattern = route.replace(/:[^/]+/g, '[^/]+')
      const regex = new RegExp(`^${pattern}$`)
      return regex.test(pathname)
    })

    const fallback = routeNames[match] || ['Dashboard']
    return fallback
  }, [location.pathname])

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="app-shell__content">
        <Topbar
          breadcrumbs={breadcrumbs}
          searchValue={globalSearch}
          onSearchChange={onGlobalSearchChange}
          onOpenSidebar={() => setMobileOpen(true)}
        />
        <main className="page-body">
          <Outlet context={{ students, courses, globalSearch }} />
        </main>
      </div>
    </div>
  )
}
