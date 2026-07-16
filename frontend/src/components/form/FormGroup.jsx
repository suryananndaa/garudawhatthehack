import './FormGroup.css'

export default function FormGroup({ label, htmlFor, children, className = '' }) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-group__label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
    </div>
  )
}
