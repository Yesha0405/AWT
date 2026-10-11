import { useEffect } from 'react'

const defaultState = {
  name: '',
  enrollment: '',
  email: '',
  course: '',
  semester: '',
  gender: '',
  attendance: '',
}

export default function StudentForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isEditing,
  courseOptions,
  error,
}) {
  useEffect(() => {
    if (!formData.name && !formData.enrollment && !formData.email) {
      onChange('course', courseOptions[0] || '')
    }
  }, [courseOptions, formData, onChange])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="panel__header">
        <h3>{isEditing ? 'Edit Student' : 'Add Student'}</h3>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="student-name">Student Name</label>
          <input
            id="student-name"
            type="text"
            value={formData.name}
            onChange={(event) => onChange('name', event.target.value)}
            placeholder="Enter full name"
          />
        </div>

        <div className="field">
          <label htmlFor="student-enrollment">Enrollment Number</label>
          <input
            id="student-enrollment"
            type="text"
            value={formData.enrollment}
            onChange={(event) => onChange('enrollment', event.target.value)}
            placeholder="Enter enrollment number"
          />
        </div>

        <div className="field">
          <label htmlFor="student-email">Email</label>
          <input
            id="student-email"
            type="email"
            value={formData.email}
            onChange={(event) => onChange('email', event.target.value)}
            placeholder="student@example.com"
          />
        </div>

        <div className="field">
          <label htmlFor="student-course">Course</label>
          <select
            id="student-course"
            value={formData.course}
            onChange={(event) => onChange('course', event.target.value)}
          >
            <option value="">Select course</option>
            {courseOptions.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="student-semester">Semester</label>
          <input
            id="student-semester"
            type="number"
            min="1"
            max="12"
            value={formData.semester}
            onChange={(event) => onChange('semester', event.target.value)}
            placeholder="1"
          />
        </div>

        <div className="field">
          <label htmlFor="student-gender">Gender</label>
          <select
            id="student-gender"
            value={formData.gender}
            onChange={(event) => onChange('gender', event.target.value)}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="field field--full">
          <label htmlFor="student-attendance">Attendance Percentage</label>
          <input
            id="student-attendance"
            type="number"
            min="0"
            max="100"
            value={formData.attendance}
            onChange={(event) => onChange('attendance', event.target.value)}
            placeholder="0 - 100"
          />
        </div>
      </div>

      <div className="actions-row">
        <button type="submit" className="button button--primary">
          {isEditing ? 'Save Student' : 'Add Student'}
        </button>
        {isEditing && (
          <button type="button" className="button button--secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export const emptyStudentForm = defaultState
