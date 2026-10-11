import { memo } from 'react'
import { Link } from 'react-router-dom'
import { getAttendanceStatus } from '../utils/attendance'

// React.memo prevents unnecessary re-renders when the dashboard renders again
// but the student data object has not changed, which keeps rendering efficient.
const StudentCard = memo(function StudentCard({ student }) {
  const attendanceStatus = getAttendanceStatus(student.attendance)

  return (
    <article className="student-card">
      <div className="student-card__header">
        <div>
          <p className="student-card__label">Student</p>
          <Link to={`/students/${student.id}`} className="student-card__name">
            {student.name}
          </Link>
        </div>
        <span className={`status-badge status-badge--${attendanceStatus.key}`}>
          {attendanceStatus.label}
        </span>
      </div>

      <dl className="student-card__meta">
        <div>
          <dt>Enrollment</dt>
          <dd>{student.enrollment}</dd>
        </div>
        <div>
          <dt>Course</dt>
          <dd>{student.course}</dd>
        </div>
        <div>
          <dt>Attendance</dt>
          <dd>{student.attendance}%</dd>
        </div>
      </dl>
    </article>
  )
})

export default StudentCard
