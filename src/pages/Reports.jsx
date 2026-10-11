import { useMemo } from 'react'
import { Download, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { getAttendanceStatus } from '../utils/attendance'

const COLORS = ['#2563eb', '#f59e0b', '#ef4444']

export default function ReportsPage({ students, courses }) {
  const courseCounts = useMemo(
    () =>
      courses.map((course) => ({
        name: course.name,
        students: students.filter((student) => student.course === course.name).length,
      })),
    [courses, students],
  )

  const attendanceDistribution = useMemo(() => {
    const summary = { Eligible: 0, Warning: 0, Detained: 0 }
    students.forEach((student) => {
      const status = getAttendanceStatus(student.attendance)
      summary[status.label] += 1
    })

    return [
      { name: 'Eligible', value: summary.Eligible },
      { name: 'Warning', value: summary.Warning },
      { name: 'Detained', value: summary.Detained },
    ]
  }, [students])

  const exportCsv = () => {
    const rows = [
      ['name', 'enrollment', 'course', 'attendance', 'status'],
      ...students.map((student) => {
        const status = getAttendanceStatus(student.attendance)
        return [student.name, student.enrollment, student.course, student.attendance, status.label]
      }),
    ]

    const csv = rows.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'campusflow-report.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="page-panel">
      <div className="page-header">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>Academic Reports</h1>
        </div>
        <button type="button" className="primary-button" onClick={exportCsv}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="stats-grid three-columns">
        <div className="stat-card neutral">
          <span className="stat-card__label">Student enrollment</span>
          <strong>{students.length}</strong>
          <small>Verified student records</small>
        </div>
        <div className="stat-card blue">
          <span className="stat-card__label">Course distribution</span>
          <strong>{courses.length}</strong>
          <small>Available academic courses</small>
        </div>
        <div className="stat-card success">
          <span className="stat-card__label">Eligible students</span>
          <strong>{attendanceDistribution[0].value}</strong>
          <small>Attendance above 75%</small>
        </div>
      </div>

      <div className="report-grid">
        <div className="table-card">
          <div className="TableHeader">
            <h3>Course-wise enrollment</h3>
            <TrendingUp size={16} />
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={courseCounts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="students" radius={[8, 8, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="table-card">
          <div className="TableHeader">
            <h3>Attendance distribution</h3>
          </div>
          <div className="chart-wrap pie-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={attendanceDistribution} dataKey="value" nameKey="name" innerRadius={48} outerRadius={76} paddingAngle={3}>
                  {attendanceDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="legend">
              {attendanceDistribution.map((item, index) => (
                <div key={item.name} className="legend-item">
                  <span className="legend-color" style={{ background: COLORS[index % COLORS.length] }} />
                  {item.name} <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="TableHeader">
          <h3>Course summary</h3>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Faculty</th>
                <th>Students enrolled</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  <td>{course.faculty}</td>
                  <td>{students.filter((student) => student.course === course.name).length}</td>
                  <td>{course.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
