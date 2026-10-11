import { Bell, ChevronDown, Search, X } from 'lucide-react'
import { useRef, useState } from 'react'

export default function Topbar({
  breadcrumbs,
  searchValue,
  onSearchChange,
  onOpenSidebar,
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const searchRef = useRef(null)

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="icon-button mobile-only" type="button" onClick={onOpenSidebar} aria-label="Open navigation">
          ☰
        </button>
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={`${crumb}-${index}`} className="breadcrumb-item">
              {crumb}
              {index < breadcrumbs.length - 1 && <span className="separator">/</span>}
            </span>
          ))}
        </nav>
      </div>

      <div className="topbar__actions">
        <label className="topbar__search" htmlFor="global-search">
          <Search size={16} />
          <input
            id="global-search"
            ref={searchRef}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search students, courses, or enrollment"
          />
          {searchValue && (
            <button type="button" className="search-clear" onClick={() => onSearchChange('')} aria-label="Clear search">
              <X size={15} />
            </button>
          )}
        </label>

        <div className="topbar__menu">
          <button type="button" className="icon-button has-indicator" aria-label="Notifications" onClick={() => setNotificationsOpen((current) => !current)}>
            <Bell size={17} />
            <span className="notification-dot" />
          </button>

          {notificationsOpen && (
            <div className="dropdown-menu dropdown-menu--right">
              <div className="dropdown-menu__header">Notifications</div>
              <div className="notification-item">3 students require attention</div>
              <div className="notification-item">2 courses updated today</div>
            </div>
          )}
        </div>

        <div className="profile-menu">
          <button type="button" className="profile-trigger" onClick={() => setProfileOpen((current) => !current)}>
            <span className="profile-avatar">AS</span>
            <span className="profile-meta">
              <strong>Admin</strong>
              <small>Semester 2026-27</small>
            </span>
            <ChevronDown size={16} />
          </button>

          {profileOpen && (
            <div className="dropdown-menu dropdown-menu--right">
              <div className="dropdown-menu__header">Profile</div>
              <button type="button" className="dropdown-item">View profile</button>
              <button type="button" className="dropdown-item">Account settings</button>
              <button type="button" className="dropdown-item danger">Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
