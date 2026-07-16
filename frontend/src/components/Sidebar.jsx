import { Home, BookOpen, Package, Truck, CreditCard, Settings, Sprout } from 'lucide-react'
import './Sidebar.css'

const NAV_ITEMS = [
  { key: 'beranda', label: 'Beranda', icon: Home },
  { key: 'produk', label: 'Produk Saya', icon: BookOpen },
  { key: 'pesanan', label: 'Pesanan', icon: Package },
  { key: 'pengiriman', label: 'Pengiriman', icon: Truck },
  { key: 'keuangan', label: 'Keuangan', icon: CreditCard },
  { key: 'pengaturan', label: 'Pengaturan', icon: Settings },
]

export default function Sidebar({ active = 'beranda', onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <h1 className="sidebar__logo">
          Tan<Sprout size={20} className="sidebar__logo-icon" aria-hidden="true" />ku
        </h1>
        <p className="sidebar__tagline">Dashboard Supplier</p>
      </div>

      <nav className="sidebar__nav" aria-label="Navigasi utama">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`sidebar__item ${active === key ? 'sidebar__item--active' : ''}`}
            onClick={() => onNavigate?.(key)}
          >
            <Icon size={18} strokeWidth={2} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
