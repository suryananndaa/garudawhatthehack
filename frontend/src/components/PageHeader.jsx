import { Plus } from 'lucide-react'
import './PageHeader.css'

export default function PageHeader({ supplierName, onAddProduct }) {
  return (
    <header className="page-header">
      <div>
        <h2 className="page-header__title">HALO, {supplierName}!</h2>
        <p className="page-header__subtitle">Berikut ringkasan aktivitas Anda hari ini.</p>
      </div>
      <button className="page-header__cta" onClick={onAddProduct}>
        <Plus size={18} strokeWidth={2.5} />
        Tambah Produk
      </button>
    </header>
  )
}
