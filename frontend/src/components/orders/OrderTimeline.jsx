import { Check, X } from 'lucide-react'
import './OrderTimeline.css'

const STEPS = [
  { key: 'menunggu', label: 'Menunggu Konfirmasi' },
  { key: 'diproses', label: 'Diproses' },
  { key: 'dikirim', label: 'Dikirim' },
  { key: 'selesai', label: 'Selesai' },
]

export default function OrderTimeline({ status }) {
  if (status === 'dibatalkan') {
    return (
      <div className="order-timeline order-timeline--cancelled">
        <div className="order-timeline__step order-timeline__step--cancelled">
          <span className="order-timeline__icon">
            <X size={14} strokeWidth={3} />
          </span>
          <span className="order-timeline__label">Pesanan Dibatalkan</span>
        </div>
      </div>
    )
  }

  const activeIndex = STEPS.findIndex((step) => step.key === status)

  return (
    <div className="order-timeline">
      {STEPS.map((step, index) => {
        const isDone = index < activeIndex
        const isCurrent = index === activeIndex
        return (
          <div
            key={step.key}
            className={`order-timeline__step ${isDone ? 'order-timeline__step--done' : ''} ${
              isCurrent ? 'order-timeline__step--current' : ''
            }`}
          >
            <span className="order-timeline__icon">
              {isDone ? <Check size={14} strokeWidth={3} /> : index + 1}
            </span>
            <span className="order-timeline__label">{step.label}</span>
            {index < STEPS.length - 1 && <span className="order-timeline__line" />}
          </div>
        )
      })}
    </div>
  )
}
