import { NavLink, useNavigate } from 'react-router-dom'
import { Home, ShoppingBag, Heart, Settings, Sprout, LogOut } from 'lucide-react'
import './Sidebar.css'

const NAV_ITEMS = [
  { key: 'beranda',  label: 'Beranda',      icon: Home,       to: '/pembeli/dashboard' },
  { key: 'pesanan',  label: 'Pesanan Saya', icon: ShoppingBag, to: '/pembeli/pesanan' },
  { key: 'favorit',  label: 'Favorit',      icon: Heart,      to: '/pembeli/favorit' },
  { key: 'pengaturan', label: 'Pengaturan', icon: Settings,   to: '/pembeli/pengaturan' },
]

export default function SidebarPembeli() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <h1 className="sidebar__logo">
          Tan<Sprout size={20} className="sidebar__logo-icon" aria-hidden="true" />ku
        </h1>
        <p className="sidebar__tagline">Dashboard Pembeli</p>
      </div>

      <nav className="sidebar__nav" aria-label="Navigasi utama">
        {NAV_ITEMS.map(({ key, label, icon: Icon, to }) => (
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
        ))}
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <button className="sidebar__item" type="button" onClick={handleLogout}>
          <LogOut size={18} strokeWidth={2} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  )
}
