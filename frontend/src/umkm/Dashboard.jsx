import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import './Dashboard.css'

// ============ DATA ============
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

// ============ MAIN DASHBOARD ============
export default function UMKMDashboard() {
  const navigate = useNavigate()
  const rawUser = localStorage.getItem('user') || sessionStorage.getItem('user')
  const user = rawUser ? JSON.parse(rawUser) : null
  const userName = user?.name || user?.email || 'Konsumen'

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

          <div className="topbar__search">
            <input type="text" placeholder="Cari produk segar (tomat, cabai, beras, ikan..)" aria-label="Cari produk" />
            <button type="button" aria-label="Cari">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <circle cx="11" cy="11" r="6.5" stroke="white" strokeWidth="2"/>
                <path d="m20 20-3.4-3.4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="topbar__actions">
            <button className="icon-btn" type="button" aria-label="Notifikasi">
              <svg viewBox="0 0 24 24" fill="none" width="19" height="19">
                <path d="M6 9a6 6 0 0 1 12 0c0 4.2 1.2 5.6 2 6.5H4c.8-.9 2-2.3 2-6.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
                <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
              </svg>
              <span className="icon-btn__dot" />
            </button>
            <button className="icon-btn" type="button" aria-label="Keranjang">
              <svg viewBox="0 0 24 24" fill="none" width="19" height="19">
                <path d="M4 6h2l1.6 10.2A2 2 0 0 0 9.6 18H18a2 2 0 0 0 2-1.6L21.5 9H6.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="10" cy="21" r="1.3" fill="currentColor"/>
                <circle cx="18" cy="21" r="1.3" fill="currentColor"/>
              </svg>
            </button>
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
                {products.map((p, i) => <ProductCard key={i} product={p} />)}
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
