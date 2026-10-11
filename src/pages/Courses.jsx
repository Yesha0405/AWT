import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const emptyCourseForm = {
  code: '',
  name: '',
  faculty: '',
  credits: '',
  description: '',
}

const validateCourse = (course, courses, editingId = null) => {
  if (!course.code.trim()) return 'Course code is required.'
  if (!course.name.trim()) return 'Course name is required.'
  if (!course.faculty.trim()) return 'Faculty name is required.'
  if (!course.credits || Number(course.credits) <= 0) return 'Credits must be greater than zero.'
  if (!course.description.trim()) return 'Course description is required.'

  const duplicateCode = courses.find(
    (item) => item.code.toLowerCase() === course.code.trim().toLowerCase() && item.id !== editingId,
  )

  if (duplicateCode) {
    return 'A course with this code already exists.'
  }

  return ''
}

export default function Courses({ students, courses, setCourses, setStudents }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [creditFilter, setCreditFilter] = useState('All')
  const [courseFormData, setCourseFormData] = useState(emptyCourseForm)
  const [formError, setFormError] = useState('')

  const filteredCourses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return courses.filter((course) => {
      const matchesSearch =
        !normalizedSearch ||
        course.code.toLowerCase().includes(normalizedSearch) ||
        course.name.toLowerCase().includes(normalizedSearch)

      const matchesCredits = creditFilter === 'All' || String(course.credits) === creditFilter

      return matchesSearch && matchesCredits
    })
  }, [creditFilter, courses, searchTerm])

  const handleFieldChange = (field, value) => {
    setCourseFormData((current) => ({ ...current, [field]: value }))
    setFormError('')
  }

  const handleCourseSubmit = () => {
    const normalizedCourse = {
      code: courseFormData.code.trim(),
      name: courseFormData.name.trim(),
      faculty: courseFormData.faculty.trim(),
      credits: Number(courseFormData.credits),
      description: courseFormData.description.trim(),
    }

    const errorMessage = validateCourse(normalizedCourse, courses)
    if (errorMessage) {
      setFormError(errorMessage)
      return
    }

    const newCourse = {
      id: `course-${Date.now()}`,
      ...normalizedCourse,
    }

    setCourses((currentCourses) => [newCourse, ...currentCourses])
    setCourseFormData(emptyCourseForm)
    setFormError('')
  }

  const handleDeleteCourse = (courseId) => {
    const targetCourse = courses.find((course) => course.id === courseId)
    if (!targetCourse) return

    const relatedStudents = students.filter((student) => student.course === targetCourse.name)
    const message = relatedStudents.length
      ? `This course has ${relatedStudents.length} enrolled students. Deleting it will update their course to General Studies. Continue?`
      : `Delete ${targetCourse.name} permanently?`

    const confirmed = window.confirm(message)
    if (!confirmed) return

    if (relatedStudents.length) {
      setStudents((currentStudents) =>
        currentStudents.map((student) =>
          student.course === targetCourse.name 
            ? { ...student, course: 'General Studies' }
            : student,
        ),
      )
    }

    setCourses((currentCourses) => currentCourses.filter((course) => course.id !== courseId))
  }

  return (
    <section className="page-panel">
      <div className="page-header">
        <div>
          <p className="eyebrow">Academic catalog</p>
          <h1>Course Management</h1>
        </div>
      </div>

      <div className="stats-grid three-columns">
        <div className="stat-card neutral">
          <span className="stat-card__label">Total courses</span>
          <strong>{courses.length}</strong>
          <small>Available in catalog</small>
        </div>
        <div className="stat-card blue">
          <span className="stat-card__label">Active programs</span>
          <strong>{courses.length}</strong>
          <small>Currently approved</small>
        </div>
        <div className="stat-card success">
          <span className="stat-card__label">Enrolled students</span>
          <strong>{students.length}</strong>
          <small>Across all courses</small>
        </div>
      </div>

      <div className="two-column-layout">
        <form className="table-card form-card" onSubmit={(event) => { event.preventDefault(); handleCourseSubmit() }}>
          <div className="TableHeader">
            <h3>Add new course</h3>
          </div>

          {formError && <div className="alert alert-error">{formError}</div>}

          <div className="form-grid">
            <div className="field">
              <label htmlFor="course-code">Course Code</label>
              <input id="course-code" type="text" value={courseFormData.code} onChange={(event) => handleFieldChange('code', event.target.value)} placeholder="BCS101" />
            </div>
            <div className="field">
              <label htmlFor="course-name">Course Name</label>
              <input id="course-name" type="text" value={courseFormData.name} onChange={(event) => handleFieldChange('name', event.target.value)} placeholder="Web Technology" />
            </div>
            <div className="field">
              <label htmlFor="course-faculty">Faculty</label>
              <input id="course-faculty" type="text" value={courseFormData.faculty} onChange={(event) => handleFieldChange('faculty', event.target.value)} placeholder="Dr. A" />
            </div>
            <div className="field">
              <label htmlFor="course-credits">Credits</label>
              <input id="course-credits" type="number" min="1" value={courseFormData.credits} onChange={(event) => handleFieldChange('credits', event.target.value)} placeholder="4" />
            </div>
            <div className="field field-full">
              <label htmlFor="course-description">Description</label>
              <textarea id="course-description" rows="4" value={courseFormData.description} onChange={(event) => handleFieldChange('description', event.target.value)} placeholder="Describe the course focus and goals" />
            </div>
          </div>

          <div className="header-actions">
            <button type="submit" className="primary-button">Add Course</button>
          </div>
        </form>

        <div className="table-card">
          <div className="TableHeader">
            <h3>Catalog listing</h3>
            <span>{filteredCourses.length} results</span>
          </div>

          <div className="toolbar-panel">
            <div className="toolbar-panel__row">
              <label className="search-field compact">
                <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search code or course" />
              </label>
              <select value={creditFilter} onChange={(event) => setCreditFilter(event.target.value)}>
                <option value="All">All credits</option>
                {[...new Set(courses.map((course) => String(course.credits)))].map((credit) => (
                  <option key={credit} value={credit}>{credit} credit{credit !== '1' ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredCourses.length ? (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Faculty</th>
                    <th>Credits</th>
                    <th>Students</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course.id}>
                      <td><Link to={`/courses/${course.id}`} className="text-link">{course.code}</Link></td>
                      <td>{course.name}</td>
                      <td>{course.faculty}</td>
                      <td>{course.credits}</td>
                      <td>{students.filter((student) => student.course === course.name).length}</td>
                      <td>
                        <div className="table-actions">
                          <Link to={`/courses/${course.id}`} className="text-link">View</Link>
                          <button type="button" className="table-action table-action--danger" onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <h4>No courses found</h4>
              <p>Try another search term or add a course.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
