import StatCard from './StatCard.jsx'
import './StatsGrid.css'

export default function StatsGrid({ stats }) {
  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
