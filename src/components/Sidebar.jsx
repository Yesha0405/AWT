import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
  ClipboardCheck,
  FileText,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/attendance', label: 'Attendance', icon: ClipboardCheck },
  { to: '/reports', label: 'Academic Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="sidebar__brand">
        <div className="sidebar__logo"><GraduationCap size={20} /></div>
        <div>
          <div className="sidebar__title">CampusFlow</div>
          <div className="sidebar__subtitle">Student &amp; Academic Management</div>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Sidebar navigation">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'active' : ''}`
            }
            onClick={onClose}
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__mini-card">
          <div className="mini-card__label">Academic year</div>
          <strong>2026-27</strong>
        </div>
      </div>
    </aside>
  )
}
