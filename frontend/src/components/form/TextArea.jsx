import './TextArea.css'

export default function TextArea({ id, ...props }) {
  return <textarea id={id} className="textarea-input" {...props} />
}
