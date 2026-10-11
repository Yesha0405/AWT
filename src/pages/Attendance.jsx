import { useMemo, useState } from 'react'
import { ArrowUpRight, Search, SlidersHorizontal } from 'lucide-react'
import { getAttendanceStatus } from '../utils/attendance'

export default function AttendancePage({ students, courses, globalSearch }) {
  const [searchTerm, setSearchTerm] = useState(globalSearch || '')
  const [courseFilter, setCourseFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredStudents = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()

    return students.filter((student) => {
      const matchesSearch =
        !normalized ||
        student.name.toLowerCase().includes(normalized) ||
        student.enrollment.toLowerCase().includes(normalized)
      const matchesCourse = courseFilter === 'All' || student.course === courseFilter
      const status = getAttendanceStatus(student.attendance)
      const matchesStatus = statusFilter === 'All' || status.label === statusFilter
      return matchesSearch && matchesCourse && matchesStatus
    })
  }, [courseFilter, searchTerm, statusFilter, students])

  const totals = useMemo(() => {
    const counts = { Eligible: 0, Warning: 0, Detained: 0 }
    students.forEach((student) => {
      const status = getAttendanceStatus(student.attendance)
      counts[status.label] += 1
    })
    return counts
  }, [students])

  return (
    <section className="page-panel">
      <div className="page-header">
        <div>
          <p className="eyebrow">Academic oversight</p>
          <h1>Attendance Management</h1>
        </div>
      </div>

      <div className="stats-grid four-columns">
        <div className="stat-card neutral">
          <span className="stat-card__label">Total students</span>
          <strong>{students.length}</strong>
          <small>Tracked across all courses</small>
        </div>
        <div className="stat-card success">
          <span className="stat-card__label">Eligible</span>
          <strong>{totals.Eligible}</strong>
          <small>{`>= 75% threshold`}</small>
        </div>
        <div className="stat-card warning">
          <span className="stat-card__label">Warning</span>
          <strong>{totals.Warning}</strong>
          <small>{`60% to 74%`}</small>
        </div>
        <div className="stat-card danger">
          <span className="stat-card__label">Detained</span>
          <strong>{totals.Detained}</strong>
          <small>{`Below 60%`}</small>
        </div>
      </div>

      <div className="toolbar-panel">
        <div className="toolbar-panel__row">
          <label className="search-field compact">
            <Search size={16} />
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search by name or enrollment" />
          </label>
          <select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}>
            <option value="All">All courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.name}>{course.name}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="All">All status</option>
            <option value="Eligible">Eligible</option>
            <option value="Warning">Warning</option>
            <option value="Detained">Detained</option>
          </select>
          <button type="button" className="secondary-button">
            <SlidersHorizontal size={15} /> Filter
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="TableHeader">
          <h3>Student attendance overview</h3>
          <span>{filteredStudents.length} Students</span>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Enrollment</th>
                <th>Course</th>
                <th>Attendance</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const status = getAttendanceStatus(student.attendance)
                return (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.enrollment}</td>
                    <td>{student.course}</td>
                    <td>
                      <div className="progress-row">
                        <div className="progress-bar"><span style={{ width: `${student.attendance}%` }} /></div>
                        <strong>{student.attendance}%</strong>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge badge-${status.key}`}>{status.label}</span>
                    </td>
                    <td>
                      {status.label === 'Eligible' && 'Meets the minimum attendance threshold'}
                      {status.label === 'Warning' && 'Needs improvement to avoid detention'}
                      {status.label === 'Detained' && 'Attendance below required policy threshold'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
