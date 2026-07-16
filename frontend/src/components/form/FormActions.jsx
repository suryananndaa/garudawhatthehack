import './FormActions.css'

export default function FormActions({ onCancel, onSubmit, cancelLabel = 'Batal', submitLabel = 'Simpan Produk' }) {
  return (
    <div className="form-actions">
      <button type="button" className="form-actions__btn form-actions__btn--ghost" onClick={onCancel}>
        {cancelLabel}
      </button>
      <button type="button" className="form-actions__btn form-actions__btn--primary" onClick={onSubmit}>
        {submitLabel}
      </button>
    </div>
  )
}
