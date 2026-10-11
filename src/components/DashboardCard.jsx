export default function DashboardCard({ title, value, accent, helper }) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card__topline">
        <span className="dashboard-card__dot" style={{ background: accent }}></span>
        <span>{title}</span>
      </div>
      <h3>{value}</h3>
      {helper && <p>{helper}</p>}
    </div>
  )
}
