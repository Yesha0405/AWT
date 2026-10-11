import { useNavigate, useParams } from 'react-router-dom'
import { getAttendanceStatus } from '../utils/attendance'

export default function StudentDetails({ students, courses }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const student = students.find((item) => item.id === id)

  if (!student) {
    return (
      <section className="page-wrap">
        <div className="empty-state empty-state--large">
          <h3>Student not found</h3>
          <p>The requested student record does not exist.</p>
          <button type="button" className="button button--primary" onClick={() => navigate('/students')}>
            Back to Students
          </button>
        </div>
      </section>
    )
  }

  const status = getAttendanceStatus(student.attendance)
  const courseRecord = courses.find((course) => course.name === student.course)

  return (
    <section className="page-wrap detail-page">
      <div className="detail-header">
        <div>
          <p className="eyebrow">Student Profile</p>
          <h2>{student.name}</h2>
        </div>
        <div className="detail-header__actions">
          <button type="button" className="button button--secondary" onClick={() => navigate('/students')}>
            Back to Students
          </button>
          <button
            type="button"
            className="button button--primary"
            onClick={() => navigate('/students', { state: { editId: student.id } })}
          >
            Edit Student
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="panel">
          <div className="panel__header">
            <h3>Student Details</h3>
            <span className={`status-badge status-badge--${status.key}`}>{status.label}</span>
          </div>

          <dl className="detail-list">
            <div>
              <dt>Name</dt>
              <dd>{student.name}</dd>
            </div>
            <div>
              <dt>Enrollment Number</dt>
              <dd>{student.enrollment}</dd>
            </div>
            <div>
              <dt>Course</dt>
              <dd>{student.course}</dd>
            </div>
            <div>
              <dt>Semester</dt>
              <dd>{student.semester}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{student.email}</dd>
            </div>
            <div>
              <dt>Gender</dt>
              <dd>{student.gender}</dd>
            </div>
            <div>
              <dt>Overall Attendance</dt>
              <dd>{student.attendance}%</dd>
            </div>
            {courseRecord && (
              <div>
                <dt>Course Credits</dt>
                <dd>{courseRecord.credits}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="panel">
          <div className="panel__header">
            <h3>Subject-wise Attendance</h3>
          </div>

          {student.subjects && student.subjects.length ? (
            <div className="table-wrap">
              <table className="data-table data-table--compact">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {student.subjects.map((subject) => (
                    <tr key={`${student.id}-${subject.name}`}>
                      <td>{subject.name}</td>
                      <td>{subject.attendance}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <h4>No subject data</h4>
              <p>Subject-wise attendance is not available for this student yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
