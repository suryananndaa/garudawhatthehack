import { Plus } from 'lucide-react'
import './PageHeader.css'

export default function PageHeader({
  title,
  subtitle,
  ctaLabel = 'Tambah Produk',
  ctaIcon: CtaIcon = Plus,
  onAddProduct,
  showCta = true,
}) {
  return (
    <header className="page-header">
      <div>
        <h2 className="page-header__title">{title}</h2>
        <p className="page-header__subtitle">{subtitle}</p>
      </div>
      {showCta && (
        <button className="page-header__cta" onClick={onAddProduct}>
          <CtaIcon size={18} strokeWidth={2.5} />
          {ctaLabel}
        </button>
      )}
    </header>
  )
}
