import { Plus } from 'lucide-react'
import './PageHeader.css'

export default function PageHeader({ title, subtitle, ctaLabel = 'Tambah Produk', onAddProduct }) {
  return (
    <header className="page-header">
      <div>
        <h2 className="page-header__title">{title}</h2>
        <p className="page-header__subtitle">{subtitle}</p>
      </div>
      {onAddProduct && (
        <button className="page-header__cta" onClick={onAddProduct}>
          <Plus size={18} strokeWidth={2.5} />
          {ctaLabel}
        </button>
      )}
    </header>
  )
}
