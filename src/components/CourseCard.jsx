import { memo } from 'react'
import { Link } from 'react-router-dom'

// This card is memoized because course details are frequently passed through list renders.
// It helps avoid redundant re-render work when unrelated state changes happen.
const CourseCard = memo(function CourseCard({ course }) {
  return (
    <article className="course-card">
      <div className="course-card__header">
        <div>
          <p className="course-card__code">{course.code}</p>
          <Link to={`/courses/${course.id}`} className="course-card__name">
            {course.name}
          </Link>
        </div>
        <span className="course-card__credits">{course.credits} Credits</span>
      </div>

      <p className="course-card__faculty">Faculty: {course.faculty}</p>
      <p className="course-card__description">{course.description}</p>
    </article>
  )
})

export default CourseCard
