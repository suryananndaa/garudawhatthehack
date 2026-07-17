import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import './Dashboard.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

// ============ DATA ============
const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'order',  title: 'Pesanan sedang diproses', desc: 'Pesanan #INV-2507160-0012 sedang disiapkan oleh produsen.', time: '10 menit lalu', unread: true },
  { id: 2, type: 'promo',  title: 'Diskon 20% Sayuran Segar', desc: 'Khusus hari ini, nikmati potongan harga untuk kategori sayuran.', time: '2 jam lalu', unread: true },
  { id: 3, type: 'order',  title: 'Pesanan telah dikirim', desc: 'Pesanan #INV-2507150-0098 sedang dalam perjalanan ke alamat Anda.', time: 'Kemarin', unread: true },
  { id: 4, type: 'system', title: 'Profil berhasil diperbarui', desc: 'Perubahan data akun Anda telah tersimpan.', time: '2 hari lalu', unread: false },
]

const INITIAL_CART = [
  { id: 1, name: 'Tomat Keriting', meta: 'Segar · Bandung', unit: 'kg', price: 12000, qty: 2 },
  { id: 2, name: 'Cabai Rawit Merah', meta: 'Pedas · Garut', unit: 'kg', price: 28000, qty: 1 },
  { id: 3, name: 'Telur Ayam Organik', meta: 'Segar · Lembang', unit: '10 butir', price: 24000, qty: 1 },
]

function formatRupiah(n) { return 'Rp ' + n.toLocaleString('id-ID') }

const products = [
  { name: "Tomat Keriting", meta: "Segar · Bandung", price: "Rp 12.000/kg", rating: "4.8", count: "120+" },
  { name: "Tomat Keriting", meta: "Segar · Bandung", price: "Rp 12.000/kg", rating: "4.8", count: "120+" },
  { name: "Tomat Keriting", meta: "Segar · Bandung", price: "Rp 12.000/kg", rating: "4.8", count: "120+" },
  { name: "Tomat Keriting", meta: "Segar · Bandung", price: "Rp 12.000/kg", rating: "4.8", count: "120+" },
  { name: "Tomat Keriting", meta: "Segar · Bandung", price: "Rp 12.000/kg", rating: "4.8", count: "120+" },
]

const producers = [
  { name: "Petani Budi",  loc: "Cileuncy, Bandung", distance: "25 KM", rating: "4.8", count: "120+" },
  { name: "Kebun Hijau",  loc: "Lembang, Bandung",  distance: "32 KM", rating: "4.6", count: "95+"  },
  { name: "Tani Maju",    loc: "Ciwidey, Bandung",  distance: "40 KM", rating: "4.7", count: "110+" },
]

// ============ HELPERS ============
function StarIcon() {
  return (
    <svg className="star" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
      <path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6L12 17l-5.9 3.5 1.3-6.6L2.5 9.3l6.6-.7Z" />
    </svg>
  )
}

function ProductCard({ product }) {
  return (
    <button className="product-card" type="button">
      <div className="product-card__img" />
      <div className="product-card__body">
        <p className="product-card__name">{product.name}</p>
        <p className="product-card__meta">{product.meta}</p>
        <p className="product-card__price">{product.price}</p>
        <p className="product-card__rating"><StarIcon /> {product.rating} ({product.count})</p>
      </div>
    </button>
  )
}

function IconBell(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="19" height="19" {...p}>
      <path d="M6 9a6 6 0 0 1 12 0c0 4.2 1.2 5.6 2 6.5H4c.8-.9 2-2.3 2-6.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
      <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  )
}
function IconCart(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="19" height="19" {...p}>
      <path d="M4 6h2l1.6 10.2A2 2 0 0 0 9.6 18H18a2 2 0 0 0 2-1.6L21.5 9H6.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="10" cy="21" r="1.3" fill="currentColor"/>
      <circle cx="18" cy="21" r="1.3" fill="currentColor"/>
    </svg>
  )
}
function IconOrderNotif(p) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...p}>
      <path d="M7 3h8l3 3v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
      <path d="M9 9h6M9 13h6M9 17h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  )
}
function IconPromoNotif(p) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...p}>
      <path d="M20 12 12 20l-9-9V4h7l9 9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
      <circle cx="7.5" cy="7.5" r="1.4" fill="currentColor"/>
    </svg>
  )
}
function IconSystemNotif(p) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M12 8v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <circle cx="12" cy="15.8" r="0.9" fill="currentColor"/>
    </svg>
  )
}

function NotificationPanel({ notifications, onMarkAllRead, onItemClick }) {
  return (
    <div className="dropdown-panel" role="menu" aria-label="Notifikasi">
      <div className="dropdown-panel__head">
        <h4>Notifikasi</h4>
        {notifications.some(n => n.unread) && (
          <button className="dropdown-panel__markall" type="button" onClick={onMarkAllRead}>
            Tandai semua dibaca
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <p className="dropdown-panel__empty">Belum ada notifikasi.</p>
      ) : (
        <ul className="dropdown-panel__list">
          {notifications.map(n => (
            <li
              key={n.id}
              className={`notif-item notif-item--${n.type}`}
              onClick={() => onItemClick(n.id)}
            >
              <span className="notif-item__icon">
                {n.type === 'order' && <IconOrderNotif />}
                {n.type === 'promo' && <IconPromoNotif />}
                {n.type === 'system' && <IconSystemNotif />}
              </span>
              <div className="notif-item__body">
                <p className="notif-item__title">
                  {n.title}
                  {n.unread && <span className="notif-item__unread-dot" />}
                </p>
                <p className="notif-item__desc">{n.desc}</p>
                <span className="notif-item__time">{n.time}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="dropdown-panel__foot">
        <a href="#">Lihat semua notifikasi</a>
      </div>
    </div>
  )
}

function CartPanel({ items, onIncrease, onDecrease, onRemove }) {
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0)
  return (
    <div className="dropdown-panel" role="menu" aria-label="Keranjang">
      <div className="dropdown-panel__head">
        <h4>Keranjang ({items.reduce((n, it) => n + it.qty, 0)})</h4>
      </div>
      {items.length === 0 ? (
        <p className="dropdown-panel__empty">Keranjang Anda masih kosong.</p>
      ) : (
        <ul className="dropdown-panel__list">
          {items.map(it => (
            <li key={it.id} className="cart-item">
              <div className="cart-item__img" />
              <div className="cart-item__body">
                <p className="cart-item__name">{it.name}</p>
                <p className="cart-item__meta">{it.meta}</p>
                <p className="cart-item__price">{formatRupiah(it.price)}/{it.unit}</p>
              </div>
              <div className="cart-item__qty">
                <button type="button" aria-label="Kurangi" onClick={() => onDecrease(it.id)}>−</button>
                <span>{it.qty}</span>
                <button type="button" aria-label="Tambah" onClick={() => onIncrease(it.id)}>+</button>
              </div>
              <button className="cart-item__remove" type="button" aria-label="Hapus" onClick={() => onRemove(it.id)}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none"><path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </li>
          ))}
        </ul>
      )}
      {items.length > 0 && (
        <div className="dropdown-panel__summary">
          <div className="dropdown-panel__summary-row">
            <span>Subtotal</span>
            <strong>{formatRupiah(total)}</strong>
          </div>
          <button className="dropdown-panel__checkout" type="button">Checkout</button>
        </div>
      )}
    </div>
  )
}

function ProducerCard({ producer }) {
  return (
    <div className="producer-card">
      <div className="producer-card__img">
        <span className="producer-card__dist">{producer.distance}</span>
      </div>
      <div className="producer-card__body">
        <p className="producer-card__name">{producer.name}</p>
        <p className="producer-card__loc">{producer.loc}</p>
        <p className="producer-card__rating"><StarIcon /> {producer.rating} ({producer.count})</p>
        <button className="producer-card__btn" type="button">Lihat Produk</button>
      </div>
    </div>
  )
}

// Kartu hasil pencarian petani (dari /api/recommend) — bentuknya mirip ProducerCard
// tapi datanya nyambung ke produk & harga asli, bukan mock.
function SearchResultCard({ item, onClick }) {
  return (
    <div className="producer-card" onClick={onClick}>
      <div className="producer-card__img">
        <span className="producer-card__dist">
          {item.distanceKm < 9000 ? `${item.distanceKm} km` : '—'}
        </span>
      </div>
      <div className="producer-card__body">
        <p className="producer-card__name">{item.supplierName}</p>
        <p className="producer-card__loc">
          {item.productName} · {item.city || 'Lokasi tidak diketahui'}
        </p>
        <p className="producer-card__loc">
          Rp {Number(item.pricePerKg).toLocaleString('id-ID')}/kg · Stok {item.quantityKg} kg
        </p>
        <p className="producer-card__rating"><StarIcon /> {item.rating?.toFixed?.(1) ?? item.rating}</p>
      </div>
    </div>
  )
}

// ============ MAIN DASHBOARD ============
export default function UMKMDashboard() {
  const navigate = useNavigate()
  const rawUser = localStorage.getItem('user') || sessionStorage.getItem('user')
  const user = rawUser ? JSON.parse(rawUser) : null
  const userName = user?.name || user?.email || 'Konsumen'

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [cartItems, setCartItems] = useState(INITIAL_CART)
  const [openPanel, setOpenPanel] = useState(null) // null | 'notif' | 'cart'
  const actionsRef = useRef(null)

  const [profileCity, setProfileCity] = useState(user?.city ?? null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  // Data real dari backend
  const [popularProducts, setPopularProducts] = useState([])
  const [trustedSuppliers, setTrustedSuppliers] = useState([])
  const [rescueDeals, setRescueDeals] = useState([])
  const [loadingPopular, setLoadingPopular] = useState(true)
  const [loadingSuppliers, setLoadingSuppliers] = useState(true)
  const [loadingRescue, setLoadingRescue] = useState(true)

  // Ambil profil lengkap (termasuk kota) buat dasar pencarian jarak terdekat
  useEffect(() => {
    const token = getToken()
    if (!token) return
    fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.user?.city) setProfileCity(d.user.city) })
      .catch(() => {})
  }, [])

  // Fetch produk populer
  useEffect(() => {
    setLoadingPopular(true)
    fetch(`${API_URL}/api/dashboard/popular?limit=5`)
      .then(r => r.json())
      .then(d => setPopularProducts(d.products || []))
      .catch(() => setPopularProducts([]))
      .finally(() => setLoadingPopular(false))
  }, [])

  // Fetch produsen terpercaya
  useEffect(() => {
    setLoadingSuppliers(true)
    const cityParam = profileCity ? `?city=${encodeURIComponent(profileCity)}&limit=3` : '?limit=3'
    fetch(`${API_URL}/api/dashboard/suppliers${cityParam}`)
      .then(r => r.json())
      .then(d => {
        console.log('Suppliers response:', d)
        setTrustedSuppliers(d.suppliers || [])
      })
      .catch((err) => {
        console.error('Error fetching suppliers:', err)
        setTrustedSuppliers([])
      })
      .finally(() => setLoadingSuppliers(false))
  }, [profileCity])

  // Fetch rescue deals (produk mau expire dengan diskon)
  useEffect(() => {
    setLoadingRescue(true)
    fetch(`${API_URL}/api/dashboard/rescue-deals?limit=6`)
      .then(r => r.json())
      .then(d => setRescueDeals(d.products || []))
      .catch(() => setRescueDeals([]))
      .finally(() => setLoadingRescue(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return

    setSearchLoading(true)
    setSearched(true)
    fetch(`${API_URL}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: q, city: profileCity, preset: 'seimbang' }),
    })
      .then(r => r.json())
      .then(d => setSearchResults(d.suppliers ?? []))
      .catch(() => setSearchResults([]))
      .finally(() => setSearchLoading(false))
  }

  useEffect(() => {
    function handleOutside(e) {
      if (actionsRef.current && !actionsRef.current.contains(e.target)) {
        setOpenPanel(null)
      }
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setOpenPanel(null)
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const unreadCount = notifications.filter(n => n.unread).length
  const cartCount = cartItems.reduce((n, it) => n + it.qty, 0)

  function togglePanel(name) {
    setOpenPanel(prev => (prev === name ? null : name))
  }
  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }
  function markOneRead(id) {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, unread: false } : n)))
  }
  function increaseQty(id) {
    setCartItems(prev => prev.map(it => (it.id === id ? { ...it, qty: it.qty + 1 } : it)))
  }
  function decreaseQty(id) {
    setCartItems(prev => prev
      .map(it => (it.id === id ? { ...it, qty: it.qty - 1 } : it))
      .filter(it => it.qty > 0))
  }
  function removeItem(id) {
    setCartItems(prev => prev.filter(it => it.id !== id))
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="umkm-app">

      {/* ============ SIDEBAR ============ */}
      <aside className="umkm-sidebar">
        <div className="brand">
          <span className="brand__mark">🌿</span>
          <span className="brand__name">Tani<span className="brand__accent">ku</span></span>
        </div>

        <nav className="nav" aria-label="Navigasi utama">
          <NavLink to="/pembeli/dashboard" end className={({ isActive }) => `nav__item${isActive ? ' nav__item--active' : ''}`}>
            <svg className="nav__icon" viewBox="0 0 24 24" fill="none">
              <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 20v-5h4v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Beranda</span>
          </NavLink>
          <NavLink to="/pembeli/pesanan" className={({ isActive }) => `nav__item${isActive ? ' nav__item--active' : ''}`}>
            <svg className="nav__icon" viewBox="0 0 24 24" fill="none">
              <path d="M7 3h8l3 3v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M9 9h6M9 13h6M9 17h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span>Pesanan Saya</span>
          </NavLink>
          <NavLink to="/pembeli/favorit" className={({ isActive }) => `nav__item${isActive ? ' nav__item--active' : ''}`}>
            <svg className="nav__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 20.5s-7.5-4.6-9.6-9A5.2 5.2 0 0 1 12 6.4 5.2 5.2 0 0 1 21.6 11.5c-2.1 4.4-9.6 9-9.6 9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
            <span>Favorit</span>
          </NavLink>
          <NavLink to="/pembeli/pengaturan" className={({ isActive }) => `nav__item${isActive ? ' nav__item--active' : ''}`}>
            <svg className="nav__icon" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M12 2.6v2.2M12 19.2v2.2M4.5 4.5l1.5 1.5M18 18l1.5 1.5M2.6 12h2.2M19.2 12h2.2M4.5 19.5 6 18M18 6l1.5-1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span>Pengaturan</span>
          </NavLink>
        </nav>

        <div className="sidebar__bottom">
          <div className="promo-card">
            <p className="promo-card__title">Bergabung jadi<br />Konsumen Premium</p>
            <p className="promo-card__sub">Dapatkan harga spesial dan rekomendasi terdekat setiap hari.</p>
            <button className="promo-card__btn" type="button">Upgrade Sekarang</button>
          </div>
          <button className="help-pill" type="button" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span>Keluar<br /><small>dari akun Taniku</small></span>
          </button>
        </div>
      </aside>

      {/* ============ MAIN ============ */}
      <main className="main">

        {/* Topbar */}
        <header className="topbar">
          <div className="topbar__greet">
            <p className="topbar__hi">Selamat Datang,</p>
            <h1 className="topbar__name">{userName}</h1>
          </div>

          <form className="topbar__search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Cari produk segar (tomat, cabai, beras, ikan..)"
              aria-label="Cari produk"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Cari">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <circle cx="11" cy="11" r="6.5" stroke="white" strokeWidth="2"/>
                <path d="m20 20-3.4-3.4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </form>

          <div className="topbar__actions" ref={actionsRef}>
            <div className="dropdown-anchor">
              <button
                className={`icon-btn${openPanel === 'notif' ? ' is-open' : ''}`}
                type="button"
                aria-label="Notifikasi"
                aria-expanded={openPanel === 'notif'}
                onClick={() => togglePanel('notif')}
              >
                <IconBell />
                {unreadCount > 0 && <span className="icon-btn__dot" />}
              </button>
              {openPanel === 'notif' && (
                <NotificationPanel
                  notifications={notifications}
                  onMarkAllRead={markAllRead}
                  onItemClick={markOneRead}
                />
              )}
            </div>
            <div className="dropdown-anchor">
              <button
                className={`icon-btn${openPanel === 'cart' ? ' is-open' : ''}`}
                type="button"
                aria-label="Keranjang"
                aria-expanded={openPanel === 'cart'}
                onClick={() => togglePanel('cart')}
              >
                <IconCart />
                {cartCount > 0 && <span className="icon-btn__count">{cartCount}</span>}
              </button>
              {openPanel === 'cart' && (
                <CartPanel
                  items={cartItems}
                  onIncrease={increaseQty}
                  onDecrease={decreaseQty}
                  onRemove={removeItem}
                />
              )}
            </div>
          </div>
        </header>

        {/* Content grid */}
        <div className="content">

          {/* LEFT COLUMN */}
          <div className="content__left">

            {/* Hero */}
            <section className="hero">
              <div className="hero__text">
                <h2>Distribusi Cerdas,<br /><span>Untung Bersama</span> 🌿</h2>
                <p>AI kami membantu Anda menemukan produsen terbaik dengan jarak terdekat dan harga paling menguntungkan.</p>
                <button className="hero__cta" type="button">
                  Pelajari Cara Kerja
                  <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div className="hero__art" aria-hidden="true">
                <svg viewBox="0 0 360 210" width="100%" height="100%">
                  <path d="M0 150 Q90 110 180 145 T360 130 V210 H0 Z" fill="#dcefe0"/>
                  <path d="M0 170 Q100 145 200 168 T360 158 V210 H0 Z" fill="#c7e6cd"/>
                  <circle cx="70" cy="70" r="30" fill="#eef6ee"/>
                  <path d="M8 6h30l6 10h44a4 4 0 0 1 4 4v34a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V10a4 4 0 0 1-4-4Z" transform="translate(210,95)" fill="#f3f0ea" stroke="#c9c2b4" strokeWidth="1.5"/>
                  <rect x="222" y="118" width="60" height="30" rx="2" fill="#fbf9f4" stroke="#c9c2b4" strokeWidth="1.5"/>
                  <rect x="256" y="70" width="46" height="34" rx="3" fill="#f0f2ea" stroke="#c9c2b4" strokeWidth="1.5"/>
                  <rect x="256" y="60" width="46" height="12" rx="2" fill="#c0392b"/>
                  <g stroke="#4c8c5a" strokeWidth="2" strokeDasharray="4 4" fill="none">
                    <path d="M60 90 C120 40 200 40 250 55"/>
                    <path d="M60 90 C90 130 150 150 195 100"/>
                  </g>
                  <circle cx="60" cy="90" r="5" fill="#3f7a4c"/>
                  <circle cx="250" cy="55" r="6" fill="#e05a3b"/>
                  <circle cx="195" cy="100" r="6" fill="#2d6b8f"/>
                  <g transform="translate(46,100)">
                    <ellipse cx="18" cy="66" rx="16" ry="4" fill="#c7e6cd"/>
                    <rect x="6" y="24" width="24" height="30" rx="4" fill="#3f7a4c"/>
                    <circle cx="18" cy="14" r="10" fill="#e8b382"/>
                    <path d="M6 10a12 8 0 0 1 24 0" fill="#caa15a"/>
                    <rect x="-4" y="34" width="26" height="18" rx="3" fill="#7a5230"/>
                  </g>
                  <g transform="translate(130,150)">
                    <rect x="0" y="0" width="90" height="34" rx="3" fill="#eef1e6" stroke="#c9c2b4" strokeWidth="1.5"/>
                    <rect x="0" y="-14" width="34" height="14" rx="2" fill="#dfe6d5" stroke="#c9c2b4" strokeWidth="1.5"/>
                    <circle cx="16" cy="34" r="6" fill="#3a3a3a"/>
                    <circle cx="72" cy="34" r="6" fill="#3a3a3a"/>
                  </g>
                </svg>
              </div>
            </section>

            {/* Kategori */}
            <section className="section">
              <h3 className="section__title">Jelajahi Kategori</h3>
              <div className="category-row">
                <button className="category-card" type="button" onClick={() => navigate('/pembeli/jelajahi/sayur')}>
                  <span className="category-card__icon">🥕</span>
                  <span>Sayuran</span>
                </button>
                <button className="category-card" type="button" onClick={() => navigate('/pembeli/jelajahi/buah')}>
                  <span className="category-card__icon">🍇</span>
                  <span>Buah</span>
                </button>
                <button className="category-card" type="button">
                  <span className="category-card__icon">⋯</span>
                  <span>Lainnya</span>
                </button>
              </div>
            </section>

            {/* FLASH SALE - RESCUE DEALS */}
            {!searched && !loadingRescue && rescueDeals.length > 0 && (
              <section className="flash-sale-section">
                <div className="flash-sale-header">
                  <div className="flash-sale-header__left">
                    <span className="flash-sale-badge">FLASH SALE</span>
                    <h3>Hemat Hingga 30% - Selamatkan dari Terbuang!</h3>
                    <p>Produk masih layak, harga super murah. Buruan sebelum kehabisan!</p>
                  </div>
                  <button className="flash-sale-viewall" onClick={() => navigate('/pembeli/jelajahi/buah')}>
                    Lihat Semua
                    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div className="flash-sale-grid">
                  {rescueDeals.map((p) => (
                    <button key={p.id} className="flash-card" type="button" onClick={() => navigate(`/pembeli/produk/${p.id}`)}>
                      <div className="flash-card__badge">
                        <span className="flash-card__discount">-{p.discount}%</span>
                      </div>
                      <div className="flash-card__img"></div>
                      <div className="flash-card__body">
                        <p className="flash-card__name">{p.name}</p>
                        <div className="flash-card__prices">
                          <span className="flash-card__price">Rp {p.pricePerKg.toLocaleString('id-ID')}</span>
                          <span className="flash-card__original">Rp {p.originalPrice.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flash-card__meta">
                          <span className="flash-card__stock">{p.quantityKg} kg</span>
                          <span className="flash-card__rating"><StarIcon /> {p.rating.toFixed(1)}</span>
                        </div>
                        <p className="flash-card__supplier">{p.supplierName}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {searched ? (
              /* Hasil Pencarian — data asli dari /api/recommend, bukan mock */
              <section className="section">
                <div className="section__head">
                  <h3 className="section__title">Hasil Pencarian: "{searchQuery}"</h3>
                </div>
                {searchLoading ? (
                  <p className="section__title" style={{ fontWeight: 400, fontSize: 13 }}>Mencari petani...</p>
                ) : searchResults.length === 0 ? (
                  <p className="section__title" style={{ fontWeight: 400, fontSize: 13 }}>
                    Tidak ada petani yang menjual "{searchQuery}" saat ini.
                  </p>
                ) : (
                  <div className="producer-row">
                    {searchResults.map((item) => (
                      <SearchResultCard
                        key={`${item.supplierId}-${item.productId}`}
                        item={item}
                        onClick={() => navigate(`/pembeli/toko/${item.supplierId}`)}
                      />
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <>
                {/* Produk Populer - DATA REAL */}
                <section className="section">
                  <div className="section__head">
                    <h3 className="section__title">Produk Populer</h3>
                    <button className="section__link" onClick={() => navigate('/pembeli/jelajahi/buah')}>Lihat semua</button>
                  </div>
                  {loadingPopular ? (
                    <p style={{ fontSize: 13, color: 'var(--ink-600)' }}>Memuat produk...</p>
                  ) : popularProducts.length === 0 ? (
                    <p style={{ fontSize: 13, color: 'var(--ink-600)' }}>Belum ada produk tersedia</p>
                  ) : (
                    <div className="product-row">
                      {popularProducts.map((p) => (
                        <button key={p.id} className="product-card" type="button" onClick={() => navigate(`/pembeli/produk/${p.id}`)}>
                          <div className="product-card__img" />
                          <div className="product-card__body">
                            <p className="product-card__name">{p.name}</p>
                            <p className="product-card__meta">{p.predictedTier} · {p.city || 'Lokasi tidak diketahui'}</p>
                            <p className="product-card__price">Rp {p.pricePerKg.toLocaleString('id-ID')}/kg</p>
                            <p className="product-card__rating"><StarIcon /> {p.rating.toFixed(1)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </section>

                {/* Produsen Terpercaya - DATA REAL */}
                <section className="section">
                  <div className="section__head">
                    <h3 className="section__title">Produsen Terpercaya{profileCity ? ` di ${profileCity}` : ''}</h3>
                  </div>
                  {loadingSuppliers ? (
                    <p style={{ fontSize: 13, color: 'var(--ink-600)' }}>Memuat produsen...</p>
                  ) : trustedSuppliers.length === 0 ? (
                    <p style={{ fontSize: 13, color: 'var(--ink-600)' }}>Belum ada produsen tersedia</p>
                  ) : (
                    <div className="producer-row">
                      {trustedSuppliers.map((s) => (
                        <button key={s.id} className="producer-card" type="button" onClick={() => navigate(`/pembeli/toko/${s.id}`)}>
                          <div className="producer-card__img"></div>
                          <div className="producer-card__body">
                            <p className="producer-card__name">{s.name}</p>
                            <p className="producer-card__loc">{s.city || 'Lokasi tidak diketahui'}</p>
                            <p className="producer-card__rating"><StarIcon /> {s.rating.toFixed(1)} ({s.productCount}+ produk)</p>
                            <button className="producer-card__btn" type="button">Lihat Produk</button>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}

          </div>

          {/* RIGHT COLUMN */}
          <div className="content__right">

            {/* Profile card */}
            <section className="profile-card">
              <div className="profile-card__cover">
                <img
                  src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=300&h=300&fit=crop"
                  alt=""
                  className="profile-card__avatar"
                />
                <div className="profile-card__id">
                  <p className="profile-card__name">
                    {userName}
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="#2fae60">
                      <path d="M12 2 14.4 4.3 17.6 3.6 18.4 6.8 21.5 8.1 20 11 21.5 13.9 18.4 15.2 17.6 18.4 14.4 17.7 12 20 9.6 17.7 6.4 18.4 5.6 15.2 2.5 13.9 4 11 2.5 8.1 5.6 6.8 6.4 3.6 9.6 4.3Z"/>
                      <path d="m8.5 12 2.3 2.3L15.5 9.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </p>
                  <span className="profile-card__tag">Pembeli</span>
                </div>
              </div>
              <p className="profile-card__desc">Akun pembeli Taniku — beli langsung dari petani.</p>

              <dl className="profile-card__info">
                <div>
                  <dt>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                    Email
                  </dt>
                  <dd>{user?.email || '-'}</dd>
                </div>
                <div>
                  <dt>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <rect x="3" y="4.5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                      <path d="M3 9.5h18M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                    Member Sejak
                  </dt>
                  <dd>Juli 2026</dd>
                </div>
              </dl>

              <button className="profile-card__btn" type="button">
                Lihat Profile Lengkap
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </section>

            {/* Tracking */}
            <section className="tracking-card">
              <div className="tracking-card__head">
                <h3>Tracking Pesanan</h3>
                <a href="#">Lihat semua</a>
              </div>

              <div className="order-box">
                <div className="order-box__top">
                  <span className="order-box__id">Order #INV-2507160-0012</span>
                  <span className="order-box__status">Diproses</span>
                </div>
                <p className="order-box__desc">Sayuran Segar &amp; Telur Organik</p>
                <p className="order-box__total">Total: Rp 1.250.000</p>
                <p className="order-box__time">16 Juli 2026 · 08:45 WIB</p>
              </div>

              <ol className="timeline">
                {[
                  { label: 'Pesanan Diterima',  time: '16 Juli 2026 · 08:45',           done: true    },
                  { label: 'Sedang Diproses',   time: '16 Juli 2026 · 09:15',           current: true },
                  { label: 'Dalam Pengiriman',  time: 'Estimasi: 16 Juli 2026 · 13:00'               },
                  { label: 'Selesai',           time: 'Estimasi: 16 Juli 2026 · 14:00'               },
                ].map((step, i) => (
                  <li key={i} className={`timeline__step${step.done ? ' timeline__step--done' : ''}${step.current ? ' timeline__step--current' : ''}`}>
                    <span className="timeline__dot" />
                    <div>
                      <p>{step.label}</p>
                      <span>{step.time}</span>
                    </div>
                  </li>
                ))}
              </ol>

              <button className="tracking-card__btn" type="button">Lacak Pesanan Lainnya</button>
            </section>

          </div>
        </div>
      </main>
    </div>
  )
}
