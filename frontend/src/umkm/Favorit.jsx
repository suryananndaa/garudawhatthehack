import { useState, useEffect, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { PRODUCTS, loadFavIds, saveFavIds, toggleFav, rupiah } from './data/products.js'
import './Favorit.css'

/* ============================================================
   HELPERS
   ============================================================ */
const rupiah_ = rupiah
const starStr = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r))
const badgeLabel = { best:'Terbaik', close:'Terdekat', price:'Harga Terbaik' }

function spawnLeaves(x, y) {
  const ls = ['🍃','🌿','🍂']
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

/* ============================================================
   PRODUCT CARD
   ============================================================ */
function ProdCard({ product, onToggleFav, onNavigateSearch }) {
  const p = product
  return (
    <article className="prod-card">
      <div className="card-img-wrap">
        <div className={`ph tint-${p.tint}`}>{p.emoji}</div>
        {p.badge && <span className={`c-badge ${p.badge}`}>{badgeLabel[p.badge]}</span>}
        <button
          className="fav-card-btn"
          onClick={e => onToggleFav(p.id, e)}
          aria-label="Hapus dari favorit"
        >❤️</button>
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
          <span className="price-main">{rupiah_(p.price)}</span>
          <span className="price-unit">/kg</span>
        </div>
        <div className="tag-row">
          {p.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <div className="card-foot">
          <button className="detail-btn" onClick={() => onNavigateSearch(p.name)}>
            Lihat Detail
          </button>
        </div>
      </div>
    </article>
  )
}

/* ============================================================
   SIDEBAR NAV
   ============================================================ */
const NAV_ITEMS = [
  { 
    to: '/pembeli/dashboard', 
    label: 'Beranda', 
    icon: (
      <svg className="nav__icon" viewBox="0 0 24 24" fill="none" width="19" height="19">
        <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 20v-5h4v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  { 
    to: '/pembeli/pesanan', 
    label: 'Pesanan Saya', 
    icon: (
      <svg className="nav__icon" viewBox="0 0 24 24" fill="none" width="19" height="19">
        <path d="M7 3h8l3 3v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M9 9h6M9 13h6M9 17h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )
  },
  { 
    to: '/pembeli/favorit', 
    label: 'Favorit', 
    icon: (
      <svg className="nav__icon" viewBox="0 0 24 24" fill="none" width="19" height="19">
        <path d="M12 20.5s-7.5-4.6-9.6-9A5.2 5.2 0 0 1 12 6.4 5.2 5.2 0 0 1 21.6 11.5c-2.1 4.4-9.6 9-9.6 9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    )
  },
  { 
    to: '/pembeli/pengaturan', 
    label: 'Pengaturan', 
    icon: (
      <svg className="nav__icon" viewBox="0 0 24 24" fill="none" width="19" height="19">
        <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M12 2.6v2.2M12 19.2v2.2M4.5 4.5l1.5 1.5M18 18l1.5 1.5M2.6 12h2.2M19.2 12h2.2M4.5 19.5 6 18M18 6l1.5-1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )
  },
]

function Sidebar({ onLogout }) {
  return (
    <aside className="umkm-sidebar">
      <div className="sidebar-inner">
        <div className="logo-row">
          <img src="/logo-taniku.PNG" alt="Taniku" className="logo-mark" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <div className="logo-word">Tan<em>iku</em></div>
        </div>
        <nav className="nav">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              {icon}<span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sb-spacer" />
        <div className="promo-card">
          <h4>Beli Lokal, Dukung Petani Indonesia</h4>
          <p>Setiap pembelianmu membantu petani lokal berkembang.</p>
          <button className="promo-btn" type="button">Pelajari Lebih →</button>
        </div>
        <button className="help-row" type="button" onClick={onLogout}>
          <div className="help-ic">🚪</div>
          <div><p>Keluar</p><small>dari akun Taniku</small></div>
        </button>
      </div>
    </aside>
  )
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function FavoritPage() {
  const navigate = useNavigate()
  const rawUser = localStorage.getItem('user') || sessionStorage.getItem('user')
  const user = rawUser ? JSON.parse(rawUser) : null
  const userName = user?.name || user?.email || 'Konsumen'

  const [favIds, setFavIds] = useState(() => loadFavIds())
  const [filterCat, setFilterCat] = useState('Semua')
  const [sort, setSort] = useState('newest')
  const [toast, setToast] = useState(null)

  // Reload favIds when page gains focus (sinkron dengan Search)
  useEffect(() => {
    const sync = () => setFavIds(loadFavIds())
    window.addEventListener('focus', sync)
    return () => window.removeEventListener('focus', sync)
  }, [])

  let toastTimer
  const showToast = msg => {
    setToast(msg)
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => setToast(null), 2200)
  }

  const handleToggleFav = useCallback((id, e) => {
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    spawnLeaves(rect.left + rect.width / 2, rect.top + rect.height / 2)
    const next = toggleFav(id)
    setFavIds(next)
    const p = PRODUCTS.find(x => x.id === id)
    showToast(`${p?.name} dihapus dari favorit`)
  }, [])

  const handleDeleteAll = () => {
    if (!window.confirm('Hapus semua dari favorit?')) return
    saveFavIds([])
    setFavIds([])
    showToast('Semua favorit dihapus')
  }

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user')
    sessionStorage.removeItem('token'); sessionStorage.removeItem('user')
    navigate('/login')
  }

  const handleNavigateSearch = (q = '') => {
    navigate(`/pembeli/search?q=${encodeURIComponent(q)}`)
  }

  // Filter + sort
  let favProds = PRODUCTS.filter(p => favIds.includes(p.id))
  const total = favProds.length
  const statSayur = favProds.filter(p => ['Sayuran','Cabai','Bawang'].includes(p.cat)).length
  const statBuah  = favProds.filter(p => p.cat === 'Buah').length

  if (filterCat !== 'Semua') favProds = favProds.filter(p => p.cat === filterCat)
  switch (sort) {
    case 'price-asc':   favProds.sort((a,b) => a.price - b.price); break
    case 'price-desc':  favProds.sort((a,b) => b.price - a.price); break
    case 'name-az':     favProds.sort((a,b) => a.name.localeCompare(b.name)); break
    case 'rating-desc': favProds.sort((a,b) => b.rating - a.rating); break
    default:            favProds.sort((a,b) => b.id - a.id); break
  }

  const FILTER_CATS = ['Semua','Sayuran','Buah','Cabai']

  return (
    <div className="favorit-app">
      <Sidebar onLogout={handleLogout} />

      <div className="favorit-main">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="search-wrap">
            <svg viewBox="0 0 24 24" fill="none" width="15" height="15" stroke="#7E8C74" strokeWidth="2">
              <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
            </svg>
            <input
              type="text"
              placeholder="Cari sayur, buah, beras, ikan..."
              onKeyDown={e => { if (e.key === 'Enter') handleNavigateSearch(e.target.value) }}
              onClick={() => handleNavigateSearch()}
              readOnly
            />
            <button className="s-go" type="button" onClick={() => handleNavigateSearch()}>
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          <div className="tb-actions">
            <button className="icon-btn" aria-label="Notifikasi">
              <svg viewBox="0 0 24 24" fill="none" width="17" height="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
              <span className="badge">2</span>
            </button>
            <div className="profile-chip">
              <div className="p-av">🧑</div>
              <div><div className="p-name">{userName}</div><div className="p-role">Business</div></div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="page-content">
          <div className="fav-header">
            <div className="fav-title-wrap">
              <p className="eyebrow">Koleksi saya</p>
              <h1>Favorit <span className="fav-leaf">🍃</span></h1>
              <p className="fav-desc">Produk pilihan yang kamu simpan dari petani terbaik.</p>
            </div>
            <div className="stats-row">
              <div className="stat-cell"><span className="stat-lbl">Total</span><span className="stat-val">{total}</span></div>
              <div className="stat-cell"><span className="stat-lbl">Sayur</span><span className="stat-val">{statSayur}</span></div>
              <div className="stat-cell"><span className="stat-lbl">Buah</span><span className="stat-val">{statBuah}</span></div>
            </div>
          </div>

          <div className="fav-filters">
            {FILTER_CATS.map(cat => (
              <button
                key={cat}
                className={`fav-pill${filterCat === cat ? ' on' : ''}`}
                onClick={() => setFilterCat(cat)}
              >
                {cat === 'Semua' ? '🌿 Semua' : cat === 'Sayuran' ? '🥬 Sayuran' : cat === 'Buah' ? '🍊 Buah' : '🌶️ Cabai'}
              </button>
            ))}
            <div className="fav-gap" />
            <select className="fav-sort" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="newest">Terbaru</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
              <option value="name-az">Nama A–Z</option>
              <option value="rating-desc">Rating Tertinggi</option>
            </select>
            <button className="del-all-btn" disabled={total === 0} onClick={handleDeleteAll}>
              🗑 Hapus Semua
            </button>
          </div>

          {filterCat !== 'Semua' && (
            <p className="result-hint">
              Menampilkan <b>{favProds.length}</b> dari <b>{total}</b> produk
            </p>
          )}

          <div className="fav-grid">
            {total === 0 ? (
              <div className="empty-state">
                <div className="es-illo">🤍</div>
                <h3>Belum ada favorit</h3>
                <p>Tekan ikon hati di produk untuk menyimpan favorit.</p>
                <button className="es-btn" onClick={() => navigate('/pembeli/jelajahi/sayur')}>
                  Jelajahi Produk
                </button>
              </div>
            ) : favProds.length === 0 ? (
              <div className="empty-state">
                <div className="es-illo">🔍</div>
                <h3>Tidak ada yang cocok</h3>
                <p>Coba ganti kategori.</p>
              </div>
            ) : (
              <>
                {favProds.map(p => (
                  <ProdCard
                    key={p.id}
                    product={p}
                    onToggleFav={handleToggleFav}
                    onNavigateSearch={handleNavigateSearch}
                  />
                ))}
                {filterCat === 'Semua' && (
                  <div className="promo-slot">
                    <div className="fl">🧺</div>
                    <h3>Koleksimu ada di sini</h3>
                    <p>Tambahkan lebih banyak produk favorit untuk kemudahan belanja.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="toast show">{toast}</div>
      )}
    </div>
  )
}
