import { useNavigate, useParams } from 'react-router-dom'

export default function CourseDetails({ courses, students }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const course = courses.find((item) => item.id === id)

  if (!course) {
    return (
      <section className="page-wrap">
        <div className="empty-state empty-state--large">
          <h3>Course not found</h3>
          <p>The requested course is unavailable.</p>
          <button type="button" className="button button--primary" onClick={() => navigate('/courses')}>
            Back to Courses
          </button>
        </div>
      </section>
    )
  }

  const enrolledStudents = students.filter((student) => student.course === course.name)

  return (
    <section className="page-wrap detail-page">
      <div className="detail-header">
        <div>
          <p className="eyebrow">Course Information</p>
          <h2>{course.name}</h2>
        </div>
        <button type="button" className="button button--secondary" onClick={() => navigate('/courses')}>
          Back to Courses
        </button>
      </div>

      <div className="detail-grid">
        <div className="panel">
          <div className="panel__header">
            <h3>Course Details</h3>
          </div>

          <dl className="detail-list">
            <div>
              <dt>Course Code</dt>
              <dd>{course.code}</dd>
            </div>
            <div>
              <dt>Course Name</dt>
              <dd>{course.name}</dd>
            </div>
            <div>
              <dt>Faculty</dt>
              <dd>{course.faculty}</dd>
            </div>
            <div>
              <dt>Credits</dt>
              <dd>{course.credits}</dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>{course.description}</dd>
            </div>
          </dl>
        </div>

        <div className="panel">
          <div className="panel__header">
            <h3>Students Enrolled</h3>
          </div>

          {enrolledStudents.length ? (
            <ul className="student-list">
              {enrolledStudents.map((student) => (
                <li key={student.id}>
                  <button type="button" className="text-button" onClick={() => navigate(`/students/${student.id}`)}>
                    {student.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <h4>No students enrolled</h4>
              <p>No students are currently registered for this course.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
