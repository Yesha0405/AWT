import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowRight, BookOpen, GraduationCap, Plus, TrendingUp, Users } from 'lucide-react'
import DashboardCard from '../components/DashboardCard'
import { getAttendanceStatus } from '../utils/attendance'

const monthlyEnrollment = [
  { month: 'Jan', students: 28 },
  { month: 'Feb', students: 35 },
  { month: 'Mar', students: 32 },
  { month: 'Apr', students: 41 },
  { month: 'May', students: 48 },
  { month: 'Jun', students: 52 },
]

export default function Dashboard({ students, courses, dashboardStats }) {
  const summaryCards = useMemo(
    () => [
      {
        title: 'Total Students',
        value: dashboardStats.totalStudents,
        accent: '#2563eb',
        helper: 'Across all active academic programs',
        icon: Users,
      },
      {
        title: 'Total Courses',
        value: dashboardStats.totalCourses,
        accent: '#8b5cf6',
        helper: 'Curriculum catalog available',
        icon: BookOpen,
      },
      {
        title: 'Active Courses',
        value: dashboardStats.activeCourses,
        accent: '#10b981',
        helper: 'Courses currently in motion',
        icon: GraduationCap,
      },
      {
        title: 'Average Attendance',
        value: `${dashboardStats.averageAttendance}%`,
        accent: '#f59e0b',
        helper: 'Across tracked records',
        icon: TrendingUp,
      },
    ],
    [dashboardStats],
  )

  const recentStudents = useMemo(() => [...students].slice(0, 4), [students])

  const attendanceBreakdown = useMemo(() => {
    const counts = { Eligible: 0, Warning: 0, Detained: 0 }
    students.forEach((student) => {
      const status = getAttendanceStatus(student.attendance)
      counts[status.label] += 1
    })

    return [
      { name: 'Eligible', value: counts.Eligible },
      { name: 'Warning', value: counts.Warning },
      { name: 'Detained', value: counts.Detained },
    ]
  }, [students])

  const courseSummary = useMemo(
    () =>
      courses.map((course) => ({
        name: course.name,
        enrolled: students.filter((student) => student.course === course.name).length,
      })),
    [courses, students],
  )

  const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444']

  return (
    <section className="page-panel">
      <div className="dashboard-hero">
        <div>
          <p className="eyebrow">Campus overview</p>
          <h1>Good morning, Administrator</h1>
          <p className="hero-subtitle">Here’s what’s happening across your campus today.</p>
        </div>
        <div className="hero-actions">
          <span className="pill">Academic year 2026-27</span>
          <Link to="/students" className="primary-button">
            <Plus size={15} /> Add Student
          </Link>
        </div>
      </div>

      <div className="stats-grid four-columns">
        {summaryCards.map(({ title, value, accent, helper, icon: Icon }) => (
          <DashboardCard key={title} title={title} value={value} accent={accent} helper={helper} icon={<Icon size={15} />} />
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <div className="TableHeader">
            <h3>Student Enrollment Overview</h3>
            <span>Monthly</span>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyEnrollment}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.08} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="students" stroke="#2563eb" fill="url(#colorStudents)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="TableHeader">
            <h3>Attendance Distribution</h3>
            <span>Live</span>
          </div>
          <div className="chart-wrap pie-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={attendanceBreakdown} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {attendanceBreakdown.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="legend">
              {attendanceBreakdown.map((entry, index) => (
                <div key={entry.name} className="legend-item">
                  <span className="legend-color" style={{ background: PIE_COLORS[index % PIE_COLORS.length] }} />
                  <span>{entry.name}</span>
                  <strong>{entry.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="TableHeader">
          <h3>Recent Students</h3>
          <Link to="/students" className="text-link">View all students <ArrowRight size={15} /></Link>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Enrollment</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Attendance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((student) => (
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
                    <span className={`status-badge badge-${getAttendanceStatus(student.attendance).key}`}>
                      {student.attendance}%
                    </span>
                  </td>
                  <td>
                    <Link to={`/students/${student.id}`} className="text-link">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-lower-grid">
        <div className="table-card">
          <div className="TableHeader">
            <h3>Course enrollment</h3>
          </div>
          <div className="chart-wrap compact-chart">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={courseSummary}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="enrolled" radius={[8, 8, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="table-card">
          <div className="TableHeader">
            <h3>Attendance alerts</h3>
          </div>
          <div className="alert-list">
            {students.filter((student) => getAttendanceStatus(student.attendance).label !== 'Eligible').slice(0, 3).map((student) => (
              <div key={student.id} className="alert-row">
                <strong>{student.name}</strong>
                <span className={`status-badge badge-${getAttendanceStatus(student.attendance).key}`}>
                  {getAttendanceStatus(student.attendance).label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="table-card">
          <div className="TableHeader">
            <h3>Recently added courses</h3>
          </div>
          <div className="mini-course-list">
            {courses.slice(0, 3).map((course) => (
              <div key={course.id} className="mini-course-item">
                <div>
                  <strong>{course.code}</strong>
                  <small>{course.name}</small>
                </div>
                <span className="chip">{course.credits} Credits</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
