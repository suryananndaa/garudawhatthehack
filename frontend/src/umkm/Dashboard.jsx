import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import './Dashboard.css'
import { PRODUCTS, loadFavIds, toggleFav, rupiah } from './data/products.js'

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

const producers = [
  { name: "Petani Budi",  loc: "Cileuncy, Bandung", distance: "25 KM", rating: "4.8", count: "120+" },
  { name: "Kebun Hijau",  loc: "Lembang, Bandung",  distance: "32 KM", rating: "4.6", count: "95+"  },
  { name: "Tani Maju",    loc: "Ciwidey, Bandung",  distance: "40 KM", rating: "4.7", count: "110+" },
]
const badgeLabel = { best: 'Terbaik', close: 'Terdekat', price: 'Harga Terbaik' }
const starStr = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r))

function spawnLeaves(x, y) {
  const ls = ['🍃', '🌿', '🍂']
  for (let i = 0; i < 5; i++) {
    const el = document.createElement('span')
    el.className = 'leaf-particle'
    el.textContent = ls[Math.floor(Math.random() * ls.length)]
    const tx = (Math.random() - .5) * 120
    const ty = -(40 + Math.random() * 80)
    const rot = (Math.random() - .5) * 360
    el.style.cssText = `left:${x}px;top:${y}px;--tx:${tx}px;--ty:${ty}px;--rot:${rot}deg;animation-delay:${i * 55}ms`
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 900 + i * 55)
  }
}

function ProductCard({ product, isFav, onToggleFav, onNavigateSearch }) {
  const p = product
  return (
    <article className="prod-card">
      <div className="card-img-wrap">
        <div className={`ph tint-${p.tint}`}>{p.emoji}</div>
        {p.badge && <span className={`c-badge ${p.badge}`}>{badgeLabel[p.badge]}</span>}
        <button
          className="fav-card-btn"
          type="button"
          onClick={e => onToggleFav(p.id, e)}
          aria-label={isFav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
        >{isFav ? '❤️' : '🤍'}</button>
        <span className="dist-pill">📍 {p.dist} km</span>
      </div>
      <div className={`card-body card-tint-${p.tint}`}>
        <p className="card-name">{p.name}</p>
        <p className="card-farmer">{p.farmer} · {p.loc}</p>
        <div className="rating-row">
          <span className="stars">{starStr(p.rating)}</span>
          <b>{p.rating}</b>
          <span>({p.reviews}+)</span>
        </div>
        <div className="price-row">
          <span className="price-main">{rupiah(p.price)}</span>
          <span className="price-unit">/kg</span>
        </div>
        <div className="tag-row">
          {p.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <div className="card-foot">
          <button className="detail-btn" type="button" onClick={() => onNavigateSearch(p.name)}>
            Lihat Detail
          </button>
        </div>
      </div>
    </article>
  )
}
// ============ HELPERS ============
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
        <p className="producer-card__rating">
          <span className="stars">{starStr(parseFloat(producer.rating))}</span>
          {' '}{producer.rating} ({producer.count})
        </p>
        <button className="producer-card__btn" type="button">Lihat Produk</button>
      </div>
    </div>
  )
}

// ============ MAIN DASHBOARD ============
export default function UMKMDashboard() {

  const [favIds, setFavIds] = useState(() => loadFavIds())

function handleToggleFav(id, e) {
  const rect = e.currentTarget.getBoundingClientRect()
  spawnLeaves(rect.left + rect.width / 2, rect.top + rect.height / 2)
  setFavIds(toggleFav(id))
}

function handleNavigateSearch(q = '') {
  navigate(`/pembeli/search?q=${encodeURIComponent(q)}`)
}

  const navigate = useNavigate()
  const rawUser = localStorage.getItem('user') || sessionStorage.getItem('user')
  const user = rawUser ? JSON.parse(rawUser) : null
  const userName = user?.name || user?.email || 'Konsumen'

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [cartItems, setCartItems] = useState(INITIAL_CART)
  const [openPanel, setOpenPanel] = useState(null) // null | 'notif' | 'cart'
  const actionsRef = useRef(null)

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
          <img src="/logo-taniku.PNG" alt="Taniku" className="brand__logo" />
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

          <div className="topbar__search" style={{ cursor:'pointer' }} onClick={() => navigate('/pembeli/search')}>
            <input type="text" placeholder="Cari produk segar (tomat, cabai, beras, ikan..)" aria-label="Cari produk" readOnly style={{ cursor:'pointer' }} />
            <button type="button" aria-label="Cari" onClick={e => { e.stopPropagation(); navigate('/pembeli/search') }}>
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <circle cx="11" cy="11" r="6.5" stroke="white" strokeWidth="2"/>
                <path d="m20 20-3.4-3.4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

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
                <h2 style={{ fontFamily: 'Lemonella', fontSize: '38px', letterSpacing: '2px'}}>Distribusi Cerdas,<br /><span>Untung Bersama</span> 🌿</h2>
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
                {[
                  { icon: '🥕', label: 'Sayuran' },
                  { icon: '🍇', label: 'Buah' },
                  { icon: '⋯', label: 'Lainnya' },
                ].map((cat) => (
                  <button key={cat.label} className="category-card" type="button">
                    <span className="category-card__icon">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Produk Populer */}
            <section className="section">
              <div className="section__head">
                <h3 className="section__title">Produk Populer</h3>
                <a href="#" className="section__link">Lihat semua</a>
              </div>
              <div className="product-row">
                {PRODUCTS.slice(0, 5).map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isFav={favIds.includes(p.id)}
                    onToggleFav={handleToggleFav}
                    onNavigateSearch={handleNavigateSearch}
                  />
                ))}
              </div>
            </section>

            {/* Produsen */}
            <section className="section">
              <div className="section__head">
                <h3 className="section__title">Produsen Terpercaya di Sekitar Anda</h3>
                <a href="#" className="section__link">Lihat semua</a>
              </div>
              <div className="producer-row">
                {producers.map((p, i) => <ProducerCard key={i} producer={p} />)}
              </div>
            </section>

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
