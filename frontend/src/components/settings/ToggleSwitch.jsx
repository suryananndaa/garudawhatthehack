import './ToggleSwitch.css'

export default function ToggleSwitch({ id, checked, onChange, label, description }) {
  return (
    <div className="toggle-row">
      <div className="toggle-row__text">
        {label && (
          <label className="toggle-row__label" htmlFor={id}>
            {label}
          </label>
        )}
        {description && <p className="toggle-row__description">{description}</p>}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        className={`toggle-switch ${checked ? 'toggle-switch--on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="toggle-switch__thumb" />
      </button>
    </div>
  )
}
