import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { PRODUCTS, toggleFav, loadFavIds, rupiah, CATEGORIES } from './data/products.js'
import './Search.css'

/* ============================================================
   HELPERS
   ============================================================ */
const starStr = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r))
const badgeLabel = { best:'Terbaik', close:'Terdekat', price:'Harga Terbaik' }

/* ============================================================
   SIDEBAR
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
   PRODUCT CARD
   ============================================================ */
function ProdCard({ product, isFav, onToggleFav, onAddCart, view }) {
  const p = product
  return (
    <article className={`prod-card${view === 'list' ? ' list-card' : ''}`}>
      <div className="card-img-wrap">
        <div className={`ph tint-${p.tint}`}>{p.emoji}</div>
        {p.badge && <span className={`c-badge ${p.badge}`}>{badgeLabel[p.badge]}</span>}
        <button className="fav-btn" type="button" onClick={() => onToggleFav(p.id)} aria-label={isFav ? 'Hapus favorit' : 'Tambah favorit'}>
          {isFav ? '❤️' : '🤍'}
        </button>
        <span className="dist-pill">📍 {p.dist} km</span>
      </div>
      <div className={`card-body card-tint-${p.tint}`}>
        <p className="card-name">{p.name}</p>
        <p className="card-farmer">{p.farmer} · {p.loc}</p>
        <div className="rating-row">
          <span className="stars">{starStr(p.rating)}</span>
          <b>{p.rating}</b><span>({p.reviews}+)</span>
        </div>
        <div className="price-row">
          <span className="price-main">{rupiah(p.price)}</span>
          <span className="price-unit">/kg</span>
        </div>
        <div className="tag-row">
          {p.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <p className="meta-row">Min. {p.minQty} kg · Est. {p.ship}</p>
        <div className="card-foot">
          <button
            className={`add-btn${onAddCart.isInCart(p.id) ? ' added' : ''}`}
            type="button"
            onClick={() => onAddCart.add(p.id)}
          >
            {onAddCart.isInCart(p.id) ? '✓ Di Keranjang' : '🛒 + Keranjang'}
          </button>
        </div>
      </div>
    </article>
  )
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function SearchPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const inputRef = useRef(null)

  const rawUser = localStorage.getItem('user') || sessionStorage.getItem('user')
  const user = rawUser ? JSON.parse(rawUser) : null
  const userName = user?.name || user?.email || 'Konsumen'

  // State
  const [query, setQuery]       = useState(searchParams.get('q') || '')
  const [cat, setCat]           = useState(searchParams.get('cat') || 'Semua')
  const [sort, setSort]         = useState('ai')
  const [view, setView]         = useState('grid')
  const [radius, setRadius]     = useState(200)
  const [quality, setQuality]   = useState('Terbaik')
  const [priceMin, setPriceMin] = useState(5000)
  const [priceMax, setPriceMax] = useState(80000)
  const [organik, setOrganik]   = useState(false)
  const [pest, setPest]         = useState(false)
  const [fresh, setFresh]       = useState(false)
  const [favIds, setFavIds]     = useState(() => loadFavIds())
  const [cart, setCart]         = useState([])
  const [toast, setToast]       = useState(null)

  // Focus search input on mount
  useEffect(() => { inputRef.current?.focus() }, [])

  // Sync query from URL params
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const c = searchParams.get('cat') || 'Semua'
    setQuery(q); setCat(c)
  }, [searchParams])

  let toastTimer
  const showToast = msg => {
    setToast(msg)
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => setToast(null), 2200)
  }

  // Filtered + sorted products
  const filtered = (() => {
    let list = [...PRODUCTS]
    if (cat !== 'Semua') list = list.filter(p => p.cat === cat)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.cat.toLowerCase().includes(q) ||
        p.farmer.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    list = list.filter(p => p.dist <= radius && p.price >= priceMin && p.price <= priceMax)
    if (quality === 'Terbaik') list = list.filter(p => p.rating >= 4.7)
    else if (quality === 'Standar') list = list.filter(p => p.rating >= 4.3 && p.rating < 4.7)
    else if (quality === 'Ekonomis') list = list.filter(p => p.rating < 4.3)
    if (organik) list = list.filter(p => p.tags.some(t => t.toLowerCase().includes('organik')))
    if (pest)    list = list.filter(p => p.tags.some(t => t.toLowerCase().includes('pesticide')))
    if (fresh)   list = list.filter(p => p.tags.some(t => t.toLowerCase().includes('fresh')))
    switch (sort) {
      case 'rating-desc': list.sort((a,b) => b.rating - a.rating); break
      case 'price-asc':   list.sort((a,b) => a.price - b.price); break
      case 'price-desc':  list.sort((a,b) => b.price - a.price); break
      case 'dist-asc':    list.sort((a,b) => a.dist - b.dist); break
      case 'name-az':     list.sort((a,b) => a.name.localeCompare(b.name)); break
      default:            list.sort((a,b) => b.rating - a.rating); break
    }
    return list
  })()

  // Cart helpers
  const cartOps = {
    isInCart: id => cart.some(c => c.id === id),
    add: id => {
      const p = PRODUCTS.find(x => x.id === id)
      if (!p) return
      setCart(prev => {
        const ex = prev.find(c => c.id === id)
        if (ex) return prev.map(c => c.id === id ? { ...c, qty: c.qty + p.minQty } : c)
        return [...prev, { id: p.id, qty: p.minQty, name: p.name, price: p.price, emoji: p.emoji }]
      })
      showToast(`${p.name} ditambahkan ke keranjang 🛒`)
    },
    remove: id => setCart(prev => prev.filter(c => c.id !== id)),
  }
  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0)

  // Fav toggle
  const handleToggleFav = id => {
    const next = toggleFav(id)
    setFavIds(next)
    const p = PRODUCTS.find(x => x.id === id)
    const isNowFav = next.includes(id)
    showToast(isNowFav ? `${p?.name} disimpan ke favorit ❤️` : `${p?.name} dihapus dari favorit`)
  }

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user')
    sessionStorage.removeItem('token'); sessionStorage.removeItem('user')
    navigate('/login')
  }

  const resetFilters = () => {
    setQuality('Terbaik'); setPriceMin(5000); setPriceMax(80000)
    setRadius(200); setOrganik(false); setPest(false); setFresh(false)
  }

  return (
    <div className="search-app">
      <Sidebar onLogout={handleLogout} />

      <div className="search-main">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="search-wrap">
            <svg viewBox="0 0 24 24" fill="none" width="15" height="15" stroke="#7E8C74" strokeWidth="2">
              <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              placeholder="Cari sayur, buah, beras, ikan..."
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Escape' && setQuery('')}
            />
            {query && (
              <button className="s-clear" type="button" onClick={() => setQuery('')}>✕</button>
            )}
            <button className="s-go" type="button" aria-label="Cari">
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          <div className="tb-actions">
            <button className="loc-btn" type="button">
              <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="#1A7D3E" strokeWidth="2" strokeLinecap="round">
                <path d="M12 21c-4-4-7-7.5-7-10.5a7 7 0 0 1 14 0c0 3-3 6.5-7 10.5Z"/>
                <circle cx="12" cy="10.5" r="2.5"/>
              </svg>
              <span>Kota Bandung ▾</span>
            </button>
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

        <div className="search-layout">
          {/* FILTER PANEL */}
          <aside className="filter-panel">
            <div className="fp-head">
              <h3>🎛 Saring Produk</h3>
              <button className="clear-link" type="button" onClick={resetFilters}>Clear</button>
            </div>
            <div className="fp-section">
              <div className="fp-label">Radius Pengiriman</div>
              <div className="fp-body">
                <div className="range-labels"><span>Radius Maks.</span><span>{radius} km</span></div>
                <input type="range" min="10" max="200" value={radius} step="10" onChange={e => setRadius(+e.target.value)} />
              </div>
            </div>
            <div className="fp-section">
              <div className="fp-label">Kualitas</div>
              <div className="fp-body">
                <div className="f-chips">
                  {['Terbaik','Standar','Ekonomis'].map(q => (
                    <button key={q} type="button" className={`f-chip${quality === q ? ' on' : ''}`} onClick={() => setQuality(q)}>{q}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="fp-section">
              <div className="fp-label">Harga per kg</div>
              <div className="fp-body">
                <div className="range-labels"><span>{rupiah(priceMin)}</span><span>{rupiah(priceMax)}</span></div>
                <input type="range" min="5000" max="80000" value={priceMin} step="1000" onChange={e => setPriceMin(+e.target.value)} />
                <input type="range" min="5000" max="80000" value={priceMax} step="1000" onChange={e => setPriceMax(+e.target.value)} />
              </div>
            </div>
            <div className="fp-section">
              <div className="fp-label">Sertifikasi</div>
              <div className="fp-body">
                <label className="chk-item"><input type="checkbox" checked={organik} onChange={e => setOrganik(e.target.checked)} /> Organik</label>
                <label className="chk-item"><input type="checkbox" checked={pest} onChange={e => setPest(e.target.checked)} /> Pesticide Safe</label>
                <label className="chk-item"><input type="checkbox" checked={fresh} onChange={e => setFresh(e.target.checked)} /> Fresh</label>
              </div>
            </div>
            <button className="fp-save" type="button">📌 Simpan Filter</button>
          </aside>

          {/* SEARCH MAIN */}
          <div className="search-main">
            {/* Cat bar */}
            <div className="cat-bar">
              {CATEGORIES.map(c => (
                <button key={c} type="button" className={`cat-btn${cat === c ? ' on' : ''}`} onClick={() => setCat(c)}>
                  <span className="cat-ic">
                    {c==='Semua'?'⊞':c==='Sayuran'?'🥬':c==='Buah'?'🍊':c==='Cabai'?'🌶️':c==='Bawang'?'🧅':c==='Daging'?'🥩':c==='Ikan'?'🐟':c==='Telur'?'🥚':'🌾'}
                  </span>
                  <span>{c}</span>
                </button>
              ))}
            </div>

            {/* AI Banner */}
            <div className="ai-banner">
              <span style={{ fontSize: 22 }}>✨</span>
              <div>
                <strong>Rekomendasi AI: Pilihan terbaik untuk Anda</strong>
                <div className="ai-tags">
                  <span className="ai-tag">✓ Kualitas Terbaik</span>
                  <span className="ai-tag">✓ Jarak Terdekat</span>
                  <span className="ai-tag">✓ Harga Kompetitif</span>
                </div>
              </div>
            </div>

            {/* Result head */}
            <div className="result-head">
              <div>
                <div className="result-title">
                  Hasil untuk <em>"{query || 'Semua Produk'}"</em>
                </div>
                <div className="result-count">{filtered.length} produk ditemukan</div>
              </div>
              <div className="result-right">
                <select className="sort-sel" value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="ai">Rekomendasi AI</option>
                  <option value="rating-desc">Rating Tertinggi</option>
                  <option value="price-asc">Harga Terendah</option>
                  <option value="price-desc">Harga Tertinggi</option>
                  <option value="dist-asc">Jarak Terdekat</option>
                  <option value="name-az">Nama A–Z</option>
                </select>
                <div className="view-btns">
                  <button type="button" className={`vbtn${view === 'grid' ? ' on' : ''}`} onClick={() => setView('grid')}>
                    <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                    </svg>
                  </button>
                  <button type="button" className={`vbtn${view === 'list' ? ' on' : ''}`} onClick={() => setView('list')}>
                    <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2">
                      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="s-empty">
                <div className="illo">🔍</div>
                <h3>Tidak ada yang cocok</h3>
                <p>Coba ubah kata kunci atau reset filter.</p>
              </div>
            ) : (
              <div className={`prod-grid${view === 'list' ? ' list' : ''}`}>
                {filtered.map(p => (
                  <ProdCard
                    key={p.id}
                    product={p}
                    isFav={favIds.includes(p.id)}
                    onToggleFav={handleToggleFav}
                    onAddCart={cartOps}
                    view={view}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
          <aside className="rp">
            <div className="rp-sec">
              <div className="rp-ttl">📋 Ringkasan Pilihan</div>
              <div className="rp-row"><span className="rp-k">Produk</span><span className="rp-v">{query || 'Semua'}</span></div>
              <div className="rp-row"><span className="rp-k">Kualitas</span><span className="rp-v">{quality}</span></div>
              <div className="rp-row"><span className="rp-k">Lokasi</span><span className="rp-v">Bandung (≤{radius} km)</span></div>
            </div>
            <div className="rp-sec">
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <div className="rp-ttl" style={{ marginBottom:0 }}>🛒 Keranjang ({cart.length})</div>
              </div>
              {cart.length === 0 ? (
                <p style={{ fontSize:12, color:'var(--muted)', textAlign:'center', padding:'12px 0' }}>Keranjang kosong</p>
              ) : (
                cart.map(c => (
                  <div key={c.id} className="ci">
                    <div className="ci-img">{c.emoji}</div>
                    <div className="ci-info">
                      <div className="ci-name">{c.name}</div>
                      <div className="ci-sub">{c.qty} kg · {rupiah(c.price)}/kg</div>
                    </div>
                    <div>
                      <div className="ci-pr">{rupiah(c.price * c.qty)}</div>
                      <button className="ci-del" type="button" onClick={() => cartOps.remove(c.id)}>🗑</button>
                    </div>
                  </div>
                ))
              )}
              <div className="cart-total-row">
                <span className="cart-total-lbl">Total Estimasi</span>
                <span className="cart-total-val">{rupiah(cartTotal)}</span>
              </div>
              <button className="checkout-btn" type="button" onClick={() => showToast('Fitur checkout belum tersedia 🛒')}>
                🛒 Lanjut ke Checkout →
              </button>
            </div>
          </aside>
        </div>
      </div>

      {toast && <div className="toast show">{toast}</div>}
    </div>
  )
}
