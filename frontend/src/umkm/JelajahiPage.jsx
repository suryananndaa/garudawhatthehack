import { useState, useEffect } from 'react'
import { useParams, useNavigate, NavLink } from 'react-router-dom'
import { toggleFav, loadFavIds } from './data/products.js'
import './JelajahiPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function StarIcon() {
  return (
    <svg className="star" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
      <path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6L12 17l-5.9 3.5 1.3-6.6L2.5 9.3l6.6-.7Z" />
    </svg>
  )
}

function ProductBrowseCard({ product, onClickProduct, onClickSupplier, isFavorited, onToggleFav }) {
  const tierColors = {
    Fresh: { bg: '#e4f1e7', text: '#2d5940', label: 'Segar' },
    Standard: { bg: '#fbf1dd', text: '#c49a3c', label: 'Standard' },
    Rescue: { bg: '#fdecea', text: '#c0392b', label: 'Rescue' },
  }
  const tier = tierColors[product.predictedTier] || tierColors.Standard
  const isRescue = product.predictedTier === 'Rescue'

  return (
    <div className="feed-card">
      {/* Header - Supplier Info */}
      <div className="feed-card__header">
        <button className="feed-card__supplier" onClick={onClickSupplier}>
          <div className="feed-card__supplier-avatar">
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="feed-card__supplier-info">
            <p className="feed-card__supplier-name">{product.supplierName}</p>
            <p className="feed-card__supplier-loc">{product.city || 'Lokasi tidak diketahui'}</p>
          </div>
        </button>
        <button className="feed-card__more">
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
            <circle cx="12" cy="12" r="1" fill="currentColor"/>
            <circle cx="12" cy="5" r="1" fill="currentColor"/>
            <circle cx="12" cy="19" r="1" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Image - Main Content */}
      <button className="feed-card__image" onClick={onClickProduct}>
        {isRescue && (
          <div className="feed-card__discount-tag">
            <span className="feed-card__discount-label">Diskon 30%</span>
          </div>
        )}
        <div className="feed-card__tier-tag" style={{ background: tier.bg, color: tier.text }}>
          {tier.label}
        </div>
      </button>

      {/* Actions Bar */}
      <div className="feed-card__actions">
        <div className="feed-card__actions-left">
          <button
            className={`feed-card__action-btn${isFavorited ? ' feed-card__action-btn--active' : ''}`}
            type="button"
            aria-label={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
            onClick={onToggleFav}
          >
            <svg viewBox="0 0 24 24" fill={isFavorited ? '#e11d48' : 'none'} width="24" height="24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke={isFavorited ? '#e11d48' : 'currentColor'} strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="feed-card__action-btn">
            <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="feed-card__action-btn">
            <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <button className="feed-card__action-btn">
          <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Content Info */}
      <div className="feed-card__content">
        <div className="feed-card__stats">
          <button className="feed-card__likes">
            <StarIcon /> {product.rating.toFixed(1)} rating
          </button>
        </div>
        <button className="feed-card__title" onClick={onClickProduct}>
          <strong>{product.productName}</strong>
        </button>
        <div className="feed-card__details">
          <div className="feed-card__price-group">
            <span className="feed-card__price">Rp {product.pricePerKg.toLocaleString('id-ID')}/kg</span>
            {isRescue && (
              <span className="feed-card__original-price">Rp {Math.round(product.pricePerKg * 1.3).toLocaleString('id-ID')}</span>
            )}
          </div>
          <span className="feed-card__stock">{product.quantityKg} kg tersedia</span>
        </div>
        {product.distanceKm && (
          <p className="feed-card__distance">{product.distanceKm} km dari lokasi Anda</p>
        )}
      </div>
    </div>
  )
}

export default function JelajahiPage() {
  const { category } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('popular')
  const [city, setCity] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [favIds, setFavIds] = useState(() => loadFavIds())

  const categoryIcon = category === 'buah' ? '🍇' : category === 'sayur' ? '🥕' : '⋯'
  const categoryLabel = category === 'buah' ? 'Buah' : category === 'sayur' ? 'Sayuran' : 'Produk'

  useEffect(() => {
    fetchProducts()
  }, [category, sort, city])

  useEffect(() => {
    // Filter produk berdasarkan search query
    if (searchQuery.trim() === '') {
      setFilteredProducts(products)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = products.filter(p => 
        p.productName.toLowerCase().includes(query) ||
        p.supplierName.toLowerCase().includes(query)
      )
      setFilteredProducts(filtered)
    }
  }, [searchQuery, products])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ sort })
      if (city) params.append('city', city)
      const res = await fetch(`${API_URL}/api/browse/${category}?${params}`)
      const data = await res.json()
      setProducts(data.products || [])
      setFilteredProducts(data.products || [])
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
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
      {/* SIDEBAR - sama seperti Dashboard */}
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

      {/* MAIN */}
      <main className="main">
        {/* Header dengan back button & title */}
        <div className="browse-header">
          <div className="browse-header-top">
            <button className="browse-back-btn" onClick={() => navigate('/pembeli/dashboard')}>
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="browse-title">
              <span className="browse-title__icon">{categoryIcon}</span>
              <h1>Jelajahi {categoryLabel}</h1>
            </div>
          </div>
        </div>

        {/* Content: 3 Kolom dengan search bar di kiri */}
        <div className="browse-layout">
          {/* LEFT: Sidebar Filter + Search */}
          <aside className="browse-sidebar-left">
            {/* Search bar */}
            <div className="browse-search">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2"/>
                <path d="m20 20-3.4-3.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder={`Cari ${categoryLabel.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Card */}
            <div className="browse-sidebar-card">
              <h3>Filter & Urutkan</h3>
              <div className="browse-filter-group">
                <label>Urutkan Berdasarkan</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="popular">Paling Populer</option>
                  <option value="cheapest">Termurah</option>
                  <option value="freshest">Paling Segar</option>
                  <option value="newest">Terbaru</option>
                </select>
              </div>
              <div className="browse-filter-group">
                <label>Lokasi (opsional)</label>
                <input
                  type="text"
                  placeholder="Masukkan kota"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            {/* Tips Card */}
            <div className="browse-sidebar-card browse-tips-card">
              <h4>Tips Belanja</h4>
              <ul>
                <li>Pilih tier "Segar" untuk kualitas terbaik</li>
                <li>Tier "Rescue" hemat hingga 30%</li>
                <li>Cek rating toko sebelum membeli</li>
                <li>Produk terdekat lebih cepat sampai</li>
              </ul>
            </div>
          </aside>

          {/* CENTER-RIGHT: Feed */}
          <div className="browse-feed-container">
            <div className="browse-results-info">
              <p>Menampilkan {filteredProducts.length} produk {categoryLabel.toLowerCase()}</p>
            </div>

            {loading ? (
              <div className="browse-loading">Memuat produk...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="browse-empty">
                <p>
                  {searchQuery 
                    ? `Tidak ditemukan "${searchQuery}" dalam ${categoryLabel.toLowerCase()}`
                    : `Belum ada produk ${categoryLabel.toLowerCase()} tersedia`
                  }
                </p>
              </div>
            ) : (
              <div className="browse-products-feed">
                {filteredProducts.map((p) => (
                  <ProductBrowseCard
                    key={p.productId}
                    product={p}
                    onClickProduct={() => navigate(`/pembeli/produk/${p.productId}`)}
                    onClickSupplier={() => navigate(`/pembeli/toko/${p.supplierId}`)}
                    isFavorited={favIds.includes(p.productId)}
                    onToggleFav={(e) => {
                      e.stopPropagation()
                      setFavIds(toggleFav(p.productId))
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Sidebar Info */}
          <aside className="browse-sidebar">
            {/* Popular Products */}
            {!loading && filteredProducts.length > 0 && (
              <div className="browse-sidebar-card">
                <h3>Produk Populer</h3>
                <div className="browse-popular-list">
                  {filteredProducts.slice(0, 5).map((p, idx) => (
                    <button
                      key={p.productId}
                      className="browse-popular-item"
                      onClick={() => navigate(`/pembeli/produk/${p.productId}`)}
                    >
                      <div className="browse-popular-rank">{idx + 1}</div>
                      <div className="browse-popular-thumb"></div>
                      <div className="browse-popular-info">
                        <p className="browse-popular-name">{p.productName}</p>
                        <p className="browse-popular-price">Rp {p.pricePerKg.toLocaleString('id-ID')}/kg</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}
