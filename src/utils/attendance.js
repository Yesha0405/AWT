export function getAttendanceStatus(attendanceValue) {
  const attendance = Number(attendanceValue) || 0

  if (attendance >= 75) {
    return { label: 'Eligible', key: 'eligible' }
  }

  if (attendance >= 60) {
    return { label: 'Warning', key: 'warning' }
  }

  return { label: 'Detained', key: 'detained' }
}
