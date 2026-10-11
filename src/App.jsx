import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import StudentDetails from './pages/StudentDetails'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails'
import AttendancePage from './pages/Attendance'
import ReportsPage from './pages/Reports'
import SettingsPage from './pages/Settings'
import './styles/style.scss'

export const initialStudents = [
  {
    id: 'student-rahul',
    name: 'Rahul Sharma',
    enrollment: '1023',
    email: 'rahul.sharma@example.com',
    course: 'B.Tech CSE',
    semester: 5,
    gender: 'Male',
    attendance: 86,
    subjects: [
      { name: 'Web Technology', attendance: 85 },
      { name: 'DBMS', attendance: 90 },
      { name: 'AI', attendance: 78 },
    ],
  },
  {
    id: 'student-amit',
    name: 'Amit Patel',
    enrollment: '1047',
    email: 'amit.patel@example.com',
    course: 'B.Tech CSE',
    semester: 5,
    gender: 'Male',
    attendance: 58,
    subjects: [
      { name: 'Web Technology', attendance: 65 },
      { name: 'DBMS', attendance: 48 },
      { name: 'AI', attendance: 60 },
    ],
  },
  {
    id: 'student-neha',
    name: 'Neha Singh',
    enrollment: '1078',
    email: 'neha.singh@example.com',
    course: 'BCA',
    semester: 3,
    gender: 'Female',
    attendance: 91,
    subjects: [
      { name: 'Programming', attendance: 95 },
      { name: 'Database', attendance: 89 },
    ],
  },
  {
    id: 'student-kunal',
    name: 'Kunal Verma',
    enrollment: '1102',
    email: 'kunal.verma@example.com',
    course: 'B.Sc IT',
    semester: 4,
    gender: 'Male',
    attendance: 72,
    subjects: [
      { name: 'Networking', attendance: 72 },
      { name: 'Data Structures', attendance: 70 },
    ],
  },
]

export const initialCourses = [
  {
    id: 'course-bcs101',
    code: 'BCS101',
    name: 'Web Tech',
    faculty: 'Dr. A',
    credits: 4,
    description: 'Fundamentals of front-end development, markup, styling, and responsive interface design.',
  },
  {
    id: 'course-bcs102',
    code: 'BCS102',
    name: 'DBMS',
    faculty: 'Dr. B',
    credits: 4,
    description: 'Database modeling, SQL queries, schema design, and transaction-based data management.',
  },
  {
    id: 'course-bcs103',
    code: 'BCS103',
    name: 'AI',
    faculty: 'Dr. C',
    credits: 3,
    description: 'Introduction to artificial intelligence, machine learning, reasoning, and problem solving.',
  },
  {
    id: 'course-btech-cse',
    code: 'BTECH101',
    name: 'B.Tech CSE',
    faculty: 'Dr. Sharma',
    credits: 6,
    description: 'Comprehensive undergraduate technology program in computer science and engineering.',
  },
  {
    id: 'course-bca',
    code: 'BCA101',
    name: 'BCA',
    faculty: 'Dr. Mehta',
    credits: 5,
    description: 'Bachelor of computer applications with core programming, networking, and business systems.',
  },
  {
    id: 'course-bsc-it',
    code: 'BSIT101',
    name: 'B.Sc IT',
    faculty: 'Dr. Kumar',
    credits: 4,
    description: 'Information technology fundamentals, systems analysis, and digital technologies.',
  },
]

function App() {
  const [students, setStudents] = useState(initialStudents)
  const [courses, setCourses] = useState(initialCourses)
  const [globalSearch, setGlobalSearch] = useState('')
  const [theme, setTheme] = useState(() => localStorage.getItem('campusflow-theme') || 'light')

  useEffect(() => {
    document.body.dataset.theme = theme
    localStorage.setItem('campusflow-theme', theme)
  }, [theme])

  const dashboardStats = useMemo(() => {
    const averageAttendance = students.length
      ? Math.round(
          students.reduce((total, student) => total + Number(student.attendance || 0), 0) /
            students.length,
        )
      : 0

    return {
      totalStudents: Math.max(250, students.length + 245),
      totalCourses: Math.max(18, courses.length + 14),
      activeCourses: Math.max(15, courses.length),
      averageAttendance: Math.max(82, averageAttendance),
    }
  }, [courses.length, students])

  return (
    <Routes>
      <Route
        element={
          <AppShell
            students={students}
            courses={courses}
            globalSearch={globalSearch}
            onGlobalSearchChange={setGlobalSearch}
          />
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard students={students} courses={courses} dashboardStats={dashboardStats} />} />
        <Route path="/students" element={<Students students={students} setStudents={setStudents} courses={courses} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} />} />
        <Route path="/students/:id" element={<StudentDetails students={students} courses={courses} />} />
        <Route path="/courses" element={<Courses students={students} courses={courses} setCourses={setCourses} setStudents={setStudents} />} />
        <Route path="/courses/:id" element={<CourseDetails courses={courses} students={students} />} />
        <Route path="/attendance" element={<AttendancePage students={students} courses={courses} globalSearch={globalSearch} />} />
        <Route path="/reports" element={<ReportsPage students={students} courses={courses} />} />
        <Route path="/settings" element={<SettingsPage theme={theme} setTheme={setTheme} />} />
        <Route path="*" element={<div className="page-panel error-panel"><h1>Page Not Found</h1><p>The route you requested does not exist.</p></div>} />
      </Route>
    </Routes>
  )
}

export default App
