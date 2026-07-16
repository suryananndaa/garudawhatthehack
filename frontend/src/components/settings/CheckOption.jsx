import { Check } from 'lucide-react'
import './CheckOption.css'

export default function CheckOption({ id, checked, onChange, label, description }) {
  return (
    <label className="check-option" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className="check-option__input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={`check-option__box ${checked ? 'check-option__box--checked' : ''}`}>
        {checked && <Check size={13} strokeWidth={3} />}
      </span>
      <span className="check-option__text">
        <span className="check-option__label">{label}</span>
        {description && <span className="check-option__description">{description}</span>}
      </span>
    </label>
  )
}
