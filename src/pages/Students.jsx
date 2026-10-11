import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import StudentForm, { emptyStudentForm } from '../components/StudentForm'
import { getAttendanceStatus } from '../utils/attendance'

const defaultForm = { ...emptyStudentForm }

const validateStudent = (student, existingStudents, editingId) => {
  if (!student.name.trim()) return 'Student name is required.'
  if (!student.enrollment.trim()) return 'Enrollment number is required.'
  if (!student.email.trim()) return 'Email is required.'
  if (!student.course.trim()) return 'Please select a course.'
  if (!student.semester || Number(student.semester) < 1 || Number(student.semester) > 12) {
    return 'Semester must be between 1 and 12.'
  }
  if (!student.gender.trim()) return 'Gender is required.'
  if (student.attendance === '' || Number(student.attendance) < 0 || Number(student.attendance) > 100) {
    return 'Attendance percentage must be between 0 and 100.'
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(student.email.trim())) {
    return 'Please enter a valid email address.'
  }

  const duplicateEnrollment = existingStudents.find(
    (item) => item.enrollment === student.enrollment.trim() && item.id !== editingId,
  )

  if (duplicateEnrollment) {
    return 'A student with this enrollment number already exists.'
  }

  return ''
}

export default function Students({ students, setStudents, courses, globalSearch, setGlobalSearch }) {
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState(globalSearch || '')
  const [courseFilter, setCourseFilter] = useState('All')
  const [semesterFilter, setSemesterFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [studentFormData, setStudentFormData] = useState(defaultForm)
  const [editingId, setEditingId] = useState(null)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    setSearchTerm(globalSearch || '')
  }, [globalSearch])

  const courseOptions = useMemo(
    () => [
      ...new Set([
        ...courses.map((course) => course.name),
        ...students.map((student) => student.course),
      ]),
    ],
    [courses, students],
  )

  const resultCounts = useMemo(() => {
    const summary = { total: students.length, eligible: 0, warning: 0, detained: 0 }
    students.forEach((student) => {
      const status = getAttendanceStatus(student.attendance)
      summary[status.key] += 1
      if (status.key === 'eligible') summary.eligible += 1
      if (status.key === 'warning') summary.warning += 1
      if (status.key === 'detained') summary.detained += 1
    })
    return summary
  }, [students])

  useEffect(() => {
    const editId = location.state?.editId
    if (!editId) return

    const selectedStudent = students.find((student) => student.id === editId)
    if (!selectedStudent) return

    setEditingId(editId)
    setStudentFormData({
      name: selectedStudent.name,
      enrollment: selectedStudent.enrollment,
      email: selectedStudent.email,
      course: selectedStudent.course,
      semester: String(selectedStudent.semester),
      gender: selectedStudent.gender,
      attendance: String(selectedStudent.attendance),
    })
    setFormError('')
  }, [location.state, students])

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return students.filter((student) => {
      const matchesSearch =
        !normalizedSearch ||
        student.name.toLowerCase().includes(normalizedSearch) ||
        student.enrollment.toLowerCase().includes(normalizedSearch) ||
        student.email.toLowerCase().includes(normalizedSearch)

      const matchesCourse = courseFilter === 'All' || student.course === courseFilter
      const matchesSemester = semesterFilter === 'All' || String(student.semester) === semesterFilter
      const status = getAttendanceStatus(student.attendance)
      const matchesStatus = statusFilter === 'All' || status.label === statusFilter

      return matchesSearch && matchesCourse && matchesSemester && matchesStatus
    })
  }, [courseFilter, searchTerm, semesterFilter, statusFilter, students])

  const handleStudentFieldChange = (field, value) => {
    setStudentFormData((current) => ({ ...current, [field]: value }))
    setFormError('')
  }

  const resetForm = () => {
    setEditingId(null)
    setStudentFormData(defaultForm)
    setFormError('')
    setGlobalSearch?.('')
  }

  const handleStudentSubmit = () => {
    const normalizedStudent = {
      name: studentFormData.name.trim(),
      enrollment: studentFormData.enrollment.trim(),
      email: studentFormData.email.trim(),
      course: studentFormData.course.trim(),
      semester: Number(studentFormData.semester),
      gender: studentFormData.gender.trim(),
      attendance: Number(studentFormData.attendance),
    }

    const errorMessage = validateStudent(normalizedStudent, students, editingId)
    if (errorMessage) {
      setFormError(errorMessage)
      return
    }

    if (editingId) {
      setStudents((currentStudents) =>
        currentStudents.map((student) =>
          student.id === editingId ? { ...student, ...normalizedStudent } : student,
        ),
      )
    } else {
      const newStudent = {
        id: `student-${Date.now()}`,
        ...normalizedStudent,
        subjects: [],
      }

      setStudents((currentStudents) => [newStudent, ...currentStudents])
    }

    resetForm()
  }

  const handleDeleteStudent = (studentId) => {
    const targetStudent = students.find((student) => student.id === studentId)
    if (!targetStudent) return

    const confirmed = window.confirm(
      `Delete ${targetStudent.name} from the student list? This action cannot be undone.`,
    )

    if (!confirmed) return

    setStudents((currentStudents) =>
      currentStudents.filter((student) => student.id !== studentId),
    )

    if (editingId === studentId) {
      resetForm()
    }
  }

  const handleEditStudent = (student) => {
    setEditingId(student.id)
    setStudentFormData({
      name: student.name,
      enrollment: student.enrollment,
      email: student.email,
      course: student.course,
      semester: String(student.semester),
      gender: student.gender,
      attendance: String(student.attendance),
    })
    setFormError('')
  }

  return (
    <section className="page-panel">
      <div className="page-header">
        <div>
          <p className="eyebrow">Student management</p>
          <h1>Students</h1>
        </div>
        <div className="header-actions">
          <button type="button" className="secondary-button">Export CSV</button>
          <button type="button" className="primary-button" onClick={() => resetForm()}>Add Student</button>
        </div>
      </div>

      <div className="stats-grid four-columns">
        <div className="stat-card neutral">
          <span className="stat-card__label">Total students</span>
          <strong>{resultCounts.total}</strong>
          <small>Active records</small>
        </div>
        <div className="stat-card success">
          <span className="stat-card__label">Eligible</span>
          <strong>{resultCounts.eligible}</strong>
          <small>{'>= 75% attendance'}</small>
        </div>
        <div className="stat-card warning">
          <span className="stat-card__label">Warning</span>
          <strong>{resultCounts.warning}</strong>
          <small>60% to 74%</small>
        </div>
        <div className="stat-card danger">
          <span className="stat-card__label">Detained</span>
          <strong>{resultCounts.detained}</strong>
          <small>Below 60%</small>
        </div>
      </div>

      <div className="two-column-layout">
        <StudentForm
          formData={studentFormData}
          onChange={handleStudentFieldChange}
          onSubmit={handleStudentSubmit}
          onCancel={resetForm}
          isEditing={Boolean(editingId)}
          courseOptions={courseOptions}
          error={formError}
        />

        <div className="table-card">
          <div className="TableHeader">
            <h3>Student directory</h3>
            <span>{filteredStudents.length} results</span>
          </div>

          <div className="toolbar-panel">
            <div className="toolbar-panel__row">
              <label className="search-field compact">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => {
                    const value = event.target.value
                    setSearchTerm(value)
                    setGlobalSearch?.(value)
                  }}
                  placeholder="Search name, enrollment, email"
                />
              </label>

              <select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}>
                <option value="All">All courses</option>
                {courseOptions.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>

              <select value={semesterFilter} onChange={(event) => setSemesterFilter(event.target.value)}>
                <option value="All">All semesters</option>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map((semester) => (
                  <option key={semester} value={String(semester)}>Semester {semester}</option>
                ))}
              </select>

              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="All">All statuses</option>
                <option value="Eligible">Eligible</option>
                <option value="Warning">Warning</option>
                <option value="Detained">Detained</option>
              </select>
            </div>
          </div>

          {filteredStudents.length ? (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Enrollment</th>
                    <th>Course</th>
                    <th>Semester</th>
                    <th>Attendance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const status = getAttendanceStatus(student.attendance)
                    return (
                      <tr key={student.id}>
                        <td>
                          <div className="student-inline">
                            <span className="avatar-badge">{student.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
                            <div>
                              <strong>{student.name}</strong>
                              <small>{student.email}</small>
                            </div>
                          </div>
                        </td>
                        <td>{student.enrollment}</td>
                        <td>{student.course}</td>
                        <td>{student.semester}</td>
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
                          <div className="table-actions">
                            <Link to={`/students/${student.id}`} className="text-link">View</Link>
                            <button type="button" className="table-action table-action--edit" onClick={() => handleEditStudent(student)}>Edit</button>
                            <button type="button" className="table-action table-action--danger" onClick={() => handleDeleteStudent(student.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <h4>No student records match current filters</h4>
              <p>Try a broader search or reset the active filters.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
