import { ChevronDown } from 'lucide-react'
import './SelectInput.css'

export default function SelectInput({ id, placeholder, options = [], ...props }) {
  return (
    <div className="select-input">
      <select id={id} defaultValue="" {...props}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value ?? option} value={option.value ?? option}>
            {option.label ?? option}
          </option>
        ))}
      </select>
      <ChevronDown size={18} className="select-input__icon" aria-hidden="true" />
    </div>
  )
}
