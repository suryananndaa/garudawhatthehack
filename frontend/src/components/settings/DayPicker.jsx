import './DayPicker.css'

const DAYS = [
  { key: 'sen', label: 'Sen' },
  { key: 'sel', label: 'Sel' },
  { key: 'rab', label: 'Rab' },
  { key: 'kam', label: 'Kam' },
  { key: 'jum', label: 'Jum' },
  { key: 'sab', label: 'Sab' },
  { key: 'min', label: 'Min' },
]

export default function DayPicker({ selectedDays, onToggleDay }) {
  return (
    <div className="day-picker">
      {DAYS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          className={`day-picker__chip ${selectedDays.includes(key) ? 'day-picker__chip--active' : ''}`}
          onClick={() => onToggleDay(key)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
