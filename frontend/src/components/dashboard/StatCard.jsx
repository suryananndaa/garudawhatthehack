import './StatCard.css'

export default function StatCard({ label, value, footnote, footnoteAccent }) {
  return (
    <div className="stat-card">
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      <p className="stat-card__footnote">
        {footnoteAccent && <span className="stat-card__accent">{footnoteAccent}</span>}
        {footnote}
      </p>
    </div>
  )
}
