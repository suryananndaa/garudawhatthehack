import './TextInput.css'

export default function TextInput({ id, prefix, ...props }) {
  return (
    <div className="text-input-wrap">
      {prefix && <span className="text-input-wrap__prefix">{prefix}</span>}
      <input id={id} className="text-input" {...props} />
    </div>
  )
}
