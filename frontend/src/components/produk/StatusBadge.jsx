import './StatusBadge.css'

const STATUS_STYLES = {
  tersedia: 'status-badge--tersedia',
  'stok-rendah': 'status-badge--stok-rendah',
  habis: 'status-badge--habis',
}

const STATUS_LABELS = {
  tersedia: 'Tersedia',
  'stok-rendah': 'Stok Rendah',
  habis: 'Habis',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${STATUS_STYLES[status] ?? ''}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
