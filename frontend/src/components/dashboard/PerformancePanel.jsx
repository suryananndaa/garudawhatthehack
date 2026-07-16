import { Star } from 'lucide-react'
import './PerformancePanel.css'

export default function PerformancePanel({ rating = 4.8, maxRating = 5 }) {
  const fullStars = Math.round(rating)

  return (
    <section className="performance-panel">
      <h3 className="performance-panel__title">Performa Toko</h3>
      <p className="performance-panel__score">
        {rating.toString().replace('.', ',')} / {maxRating}
      </p>
      <div className="performance-panel__stars" role="img" aria-label={`Rating ${rating} dari ${maxRating}`}>
        {Array.from({ length: maxRating }).map((_, i) => (
          <Star
            key={i}
            size={20}
            fill={i < fullStars ? 'currentColor' : 'none'}
            strokeWidth={1.5}
          />
        ))}
      </div>
    </section>
  )
}
