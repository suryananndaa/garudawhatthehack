import { Calendar } from 'lucide-react'
import './DateInput.css'

export default function DateInput({ id, placeholder = 'Pilih tanggal', ...props }) {
  return (
    <div className="date-input">
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        onFocus={(e) => (e.target.type = 'date')}
        onBlur={(e) => {
          if (!e.target.value) e.target.type = 'text'
        }}
        {...props}
      />
      <Calendar size={17} className="date-input__icon" aria-hidden="true" />
    </div>
  )
}
