import { NavLink, useNavigate } from 'react-router-dom'
import { Home, BookOpen, Package, Truck, Settings, Sprout, LogOut } from 'lucide-react'
import './Sidebar.css'

// Item dengan `to` akan berpindah halaman sungguhan lewat react-router.
// Item tanpa `to` masih placeholder (belum ada halamannya).
const NAV_ITEMS = [
  { key: 'beranda',    label: 'Beranda',     icon: Home,       to: '/petani/dashboard' },
  { key: 'produk',     label: 'Produk Saya', icon: BookOpen,   to: '/petani/produk-saya' },
  { key: 'pesanan',    label: 'Pesanan',     icon: Package,    to: '/petani/pesanan' },
  { key: 'pengiriman', label: 'Pengiriman',  icon: Truck,      to: '/petani/pengiriman' },
  { key: 'pengaturan', label: 'Pengaturan',  icon: Settings,   to: '/petani/pengaturan' },
]

export default function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <h1 className="sidebar__logo">
          Tan<Sprout size={20} className="sidebar__logo-icon" aria-hidden="true" />ku
        </h1>
        <p className="sidebar__tagline">Dashboard Supplier</p>
      </div>

      <nav className="sidebar__nav" aria-label="Navigasi utama">
        {NAV_ITEMS.map(({ key, label, icon: Icon, to }) =>
          to ? (
            <NavLink
              key={key}
              to={to}
              end
              className={({ isActive }) =>
                `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
              }
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ) : (
            <button key={key} className="sidebar__item" type="button">
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </button>
          )
        )}
      </nav>

      <div className="sidebar__footer">
        <button className="sidebar__item sidebar__logout" type="button" onClick={handleLogout}>
          <LogOut size={18} strokeWidth={2} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  )
}
